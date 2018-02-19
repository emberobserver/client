import { inject as service } from '@ember/service';
import { mapBy, sum, notEmpty, or } from '@ember/object/computed';
import { scheduleOnce } from '@ember/runloop';
import { resolve } from 'rsvp';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty, isBlank } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';
import config from 'ember-observer/config/environment';

const PageSize = config.codeSearchPageSize;

export default Component.extend({
  metrics: service(),

  store: service(),

  features: service(),

  codeQuery: null,

  sort: null,

  fileFilter: null,

  classNames: ['code-search'],

  focusNode: '#code-search-input',

  codeSearch: service(),

  usageCounts: mapBy('results.rawResults', 'count'),

  filteredUsageCounts: mapBy('results.filteredResults', 'count'),

  totalUsageCount: sum('usageCounts'),

  totalFilteredUsageCount: sum('filteredUsageCounts'),

  isFilterApplied: notEmpty('fileFilter'),

  showFilteredUsages: computed('isFilterApplied', 'isUpdatingFilter', function() {
    return this.get('isFilterApplied') && !this.get('isUpdatingFilter');
  }),

  init() {
    this._super(...arguments);
    this.set('searchInput', this.get('codeQuery') || '');
    this.get('search').perform();
  },

  hasSearchedAndNoResults: computed('results.length', 'search.isIdle', function() {
    return this.get('results.length') === 0 && this.get('search.isIdle');
  }),
  queryIsValid: computed('searchInput', function() {
    let input = this.get('searchInput');
    return !(isBlank(input) || input.length < 2);
  }),
  search: task(function* () {
    let query = this.get('searchInput').trim();
    this.set('results', null);

    if (!this.get('queryIsValid')) {
      return;
    }

    this.get('metrics').trackEvent({ category: 'Code Search', action: 'Search', label: query });

    this.set('codeQuery', query);
    let results = yield this.get('codeSearch').addons(query, this.get('regex'));
    this.set('quotedLastSearch', quoteSearchTerm(query, this.get('regex')));

    let filteredResults = filterByFilePath(results, this.get('fileFilter'));

    let firstPageOfResults = yield this._fetchPageOfAddonResults(filteredResults, 1, this.get('sort'));
    this.set('results',
      {
        displayingResults: firstPageOfResults,
        lastResultPageDisplaying: 1,
        rawResults: results,
        length: results.length,
        filteredResults: filteredResults,
        filteredResultLength: filteredResults.length
      });
  }).restartable(),

  applyFileFilter: task(function*(fileFilter) {
    yield timeout(500);

    this.set('fileFilter', fileFilter);
    let filteredResults = filterByFilePath((this.get('results.rawResults')), fileFilter);
    let firstPageOfFilteredResults = yield this._fetchPageOfAddonResults(filteredResults, 1, this.get('sort'));
    this.set('results.displayingResults', firstPageOfFilteredResults);
    this.set('results.lastResultPageDisplaying', 1);
    this.set('results.filteredResults', filteredResults);
    this.set('results.filteredResultLength', filteredResults.length);
  }).restartable(),

  clearFileFilter: task(function*() {
    this.set('fileFilter', null);
    let firstPageOfResults = yield this._fetchPageOfAddonResults(this.get('results.rawResults'), 1, this.get('sort'));
    this.set('results.displayingResults', firstPageOfResults);
    this.set('results.lastResultPageDisplaying', 1);
    this.set('results.filteredResults', this.get('results.rawResults'));
    this.set('results.filteredResultLength', this.get('results.length'));
  }),

  _fetchPageOfAddonResults(results, page, sort) {
    if (!results || !results.length) {
      return resolve(null);
    }

    let sortedResults = sortResults(results, sort);
    let pageOfResults = sortedResults.slice((page - 1) * PageSize, page * PageSize);
    let names = pageOfResults.mapBy('addonName');
    return this.get('store').query('addon', { filter: { name: names.join(',') }, include: 'categories' }).then((addons) => {
      return pageOfResults.map((result) => {
        return {
          addon: addons.findBy('name', result.addonName),
          count: result.count,
          score: result.score,
          files: result.files
        };
      });
    });
  },

  canViewMore: computed('results.displayingResults.length', 'results.filteredResultLength', function() {
    return this.get('results.displayingResults.length') < this.get('results.filteredResultLength');
  }),

  viewMore: task(function* () {
    let pageToFetch = this.get('results.lastResultPageDisplaying') + 1;
    let moreAddons = yield this._fetchPageOfAddonResults(this.get('results.filteredResults'), pageToFetch, this.get('sort'));
    this.get('results.displayingResults').pushObjects(moreAddons);
    this.set('results.lastResultPageDisplaying', pageToFetch);
  }),

  sortBy: task(function* (key) {
    this.set('sort', key);
    let sortedAddons = yield this._fetchPageOfAddonResults(this.get('results.filteredResults'), 1, key);
    this.set('results.displayingResults', sortedAddons);
    this.set('results.lastResultPageDisplaying', 1);
  }),

  focus() {
    this.$(this.get('focusNode')).focus();
  },

  isUpdatingResults: or('applyFileFilter.isRunning', 'clearFileFilter.isRunning', 'sortBy.isRunning'),

  isUpdatingFilter: or('applyFileFilter.isRunning', 'clearFileFilter.isRunning'),

  actions: {
    clearSearch() {
      this.set('codeQuery', '');
      this.set('searchInput', '');
      this.set('results', null);
      scheduleOnce('afterRender', this, 'focus');
    }
  }
});

function sortResults(results, sort) {
  if (sort === 'score') {
    return results.sortBy('score').reverse();
  }

  if (sort === 'usages') {
    return results.sortBy('count').reverse();
  }

  if (sort === 'name') {
    return results.sortBy('addonName');
  }
}

function quoteSearchTerm(searchTerm, isRegex) {
  let character = isRegex ? '/' : '"';
  return `${character}${searchTerm}${character}`;
}

function filterByFilePath(results, filterTerm) {
  if (isEmpty(filterTerm)) {
    return results;
  }

  let filteredList = [];
  let filterRegex;
  try {
    filterRegex = new RegExp(filterTerm);
  } catch(e) {
    return [];
  }
  results.forEach((result) => {
    let filteredFiles = result.files.filter((filePath) => {
      return filePath.match(filterRegex);
    });
    if (filteredFiles.length > 0) {
      filteredList.push({
        addonName: result.addonName,
        files: filteredFiles,
        count: filteredFiles.length
      });
    }
  });
  return filteredList;
}

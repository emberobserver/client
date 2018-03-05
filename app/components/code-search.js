import { inject as service } from '@ember/service';
import { mapBy, sum, notEmpty, or } from '@ember/object/computed';
import { scheduleOnce } from '@ember/runloop';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty, isBlank } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';
import config from 'ember-observer/config/environment';

const PageSize = config.codeSearchPageSize;

export default Component.extend({
  metrics: service(),
  store: service(),
  codeSearch: service(),

  codeQuery: null,
  sort: null,
  fileFilter: null,
  quotedLastSearch: null,
  page: 1,

  classNames: ['code-search'],
  focusNode: '#code-search-input',

  usageCounts: mapBy('results', 'count'),
  totalUsageCount: sum('usageCounts'),
  filteredUsageCounts: mapBy('filteredResults', 'count'),
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
  cleanedSearchInput: computed('searchInput', function() {
    return this.get('searchInput').trim();
  }),
  filteredResults: computed('results', 'fileFilter', function() {
    if (this.get('fileFilter')) {
      return filterByFilePath(this.get('results'), this.get('fileFilter'));
    } else {
      return this.get('results');
    }
  }),
  sortedFilteredResults: computed('filteredResults', 'sort', function() {
    return sortResults(this.get('filteredResults'), this.get('sort'));
  }),
  displayingResults: computed('sortedFilteredResults', 'page', function() {
    return this._getResultsUpToPage(this.get('sortedFilteredResults'), this.get('page'));
  }),
  search: task(function* () {
    let query = this.get('cleanedSearchInput');
    this.set('results', null);
    this.set('page', 1);

    if (!this.get('queryIsValid')) {
      return;
    }

    this.get('metrics').trackEvent({ category: 'Code Search', action: 'Search', label: query });

    this.set('codeQuery', query);
    let results = yield this.get('codeSearch.addons').perform(query, this.get('regex'));
    this.set('quotedLastSearch', quoteSearchTerm(query, this.get('regex')));

    this.set('results', results);
  }).restartable(),

  applyFileFilter: task(function*(fileFilter) {
    yield timeout(250);

    if (!isEmpty(fileFilter)) {
      this.set('fileFilter', fileFilter);
    }
  }).restartable(),

  clearFileFilter() {
    this.set('page', 1);
    this.set('fileFilter', null);
  },

  _getResultsUpToPage(results, page) {
    if (!results || !results.length) {
      return null;
    }

    return results.slice(0, page * PageSize);
  },

  canViewMore: computed('displayingResults.length', 'filteredResults.length', function() {
    return this.get('displayingResults.length') < this.get('filteredResults.length');
  }),

  viewMore() {
    this.set('page', this.get('page') + 1);
  },

  sortBy(key) {
    this.set('page', 1);
    this.set('sort', key);
  },

  focus() {
    this.$(this.get('focusNode')).focus();
  },

  isUpdatingResults: or('applyFileFilter.isRunning'),

  isUpdatingFilter: or('applyFileFilter.isRunning'),

  actions: {
    clearSearch() {
      this.set('codeQuery', '');
      this.set('searchInput', '');
      this.set('results', null);
      this.set('page', 1);
      scheduleOnce('afterRender', this, 'focus');
    }
  }
});

function sortResults(results, sort) {
  if (sort === 'usages') {
    return results.sortBy('count').reverse();
  }

  if (sort === 'name') {
    return results.sortBy('addon.name');
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
        addon: result.addon,
        files: filteredFiles,
        count: filteredFiles.length
      });
    }
  });
  return filteredList;
}

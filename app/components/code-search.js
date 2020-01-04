import { inject as service } from '@ember/service';
import { mapBy, sum, notEmpty, readOnly } from '@ember/object/computed';
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
  sortAscending: null,
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
  isDisplayingFilteredResults: computed('isFilterApplied', 'isUpdatingFilter', function() {
    return this.isFilterApplied && !this.isUpdatingFilter;
  }),

  init() {
    this._super(...arguments);
    this.set('searchInput', this.codeQuery || '');
    this.search.perform();
  },

  hasSearchedAndNoResults: computed('results.length', 'search.isIdle', function() {
    return this.get('results.length') === 0 && this.get('search.isIdle');
  }),
  queryIsValid: computed('searchInput', function() {
    let input = this.searchInput;
    return !(isBlank(input) || input.length < 2);
  }),
  cleanedSearchInput: computed('searchInput', function() {
    return this.searchInput.trim();
  }),
  filteredResults: computed('results', 'fileFilter', function() {
    if (this.fileFilter) {
      return filterByFilePath(this.results, this.fileFilter);
    } else {
      return this.results;
    }
  }),
  sortedFilteredResults: computed('filteredResults', 'sort', 'sortAscending', function() {
    return sortResults(this.filteredResults, this.sort, this.sortAscending);
  }),
  displayingResults: computed('sortedFilteredResults', 'page', function() {
    return this._getResultsUpToPage(this.sortedFilteredResults, this.page);
  }),
  search: task(function* () {
    let query = this.cleanedSearchInput;
    this.set('results', null);
    this.set('page', 1);

    if (!this.queryIsValid) {
      return;
    }

    this.metrics.trackEvent({ category: 'Code Search', action: 'Search', label: query });

    this.set('codeQuery', query);
    let results = yield this.get('codeSearch.addons').perform(query, this.regex);
    this.set('quotedLastSearch', quoteSearchTerm(query, this.regex));

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
    this.set('page', this.page + 1);
  },

  sortBy(key) {
    let oldKey = this.sort;
    if (oldKey === key || this.sortAscending !== defaultSortAscendingFor(key)) {
      this.set('sortAscending', !this.sortAscending);
    }

    this.set('sort', key);
  },

  focus() {
    document.querySelector(this.focusNode).focus();
  },

  isUpdatingResults: readOnly('applyFileFilter.isRunning'),

  isUpdatingFilter: readOnly('applyFileFilter.isRunning'),

  clearSearch() {
    this.set('codeQuery', '');
    this.set('searchInput', '');
    this.set('results', null);
    this.set('page', 1);
    scheduleOnce('afterRender', this, 'focus');
  }
});

function sortResults(results, sort, sortAscending) {
  let sorted;

  if (sort === 'usages') {
    sorted = results.sortBy('count');
  }

  if (sort === 'name') {
    sorted = results.sortBy('addon.name');
  }

  if (sort === 'score') {
    sorted = results.sortBy('addon.score');
  }

  if (sort === 'updated') {
    sorted = results.sortBy('addon.latestVersionDate');
  }

  if (!sortAscending) {
    sorted = sorted.reverse();
  }

  return sorted;
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

function defaultSortAscendingFor(key) {
  if (key === 'name') {
    return true;
  }
  return false;
}

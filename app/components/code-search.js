import { compare } from '@ember/utils';
import { classNames } from '@ember-decorators/component';
import { action, computed, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { readOnly, notEmpty } from '@ember/object/computed';
import { scheduleOnce } from '@ember/runloop';
import Component from '@ember/component';
import { isEmpty, isBlank } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';
import config from 'ember-observer/config/environment';
import asArray from 'ember-observer/utils/as-array';

const PageSize = config.codeSearchPageSize;

@classNames('code-search')
export default class CodeSearch extends Component {
  @service
  metrics;

  @service
  store;

  @service
  codeSearch;

  codeQuery = null;
  sort = null;
  sortAscending = null;
  fileFilter = null;
  quotedLastSearch = null;
  page = 1;
  focusNode = '#code-search-input';

  get usageCounts() {
    return asArray(get(this, 'results')).map((item) => item.count);
  }

  get totalUsageCount() {
    return asArray(get(this, 'usageCounts')).reduce((total, value) => total + value, 0);
  }

  get filteredUsageCounts() {
    return asArray(get(this, 'filteredResults')).map((item) => item.count);
  }

  get totalFilteredUsageCount() {
    return asArray(get(this, 'filteredUsageCounts')).reduce((total, value) => total + value, 0);
  }

  @notEmpty('fileFilter')
  isFilterApplied;

  @computed('isFilterApplied', 'isUpdatingFilter')
  get isDisplayingFilteredResults() {
    return this.isFilterApplied && !this.isUpdatingFilter;
  }

  init() {
    super.init(...arguments);
    this.set('searchInput', this.codeQuery || '');
    this.search.perform();
  }

  @computed('results.length', 'search.isIdle')
  get hasSearchedAndNoResults() {
    return this.get('results.length') === 0 && this.get('search.isIdle');
  }

  @computed('searchInput')
  get queryIsValid() {
    let input = this.searchInput;
    return !(isBlank(input) || input.length < 2);
  }

  @computed('searchInput')
  get cleanedSearchInput() {
    return this.searchInput.trim();
  }

  @computed('results', 'fileFilter')
  get filteredResults() {
    if (this.fileFilter) {
      return filterByFilePath(this.results, this.fileFilter);
    } else {
      return this.results;
    }
  }

  @computed('filteredResults', 'sort', 'sortAscending')
  get sortedFilteredResults() {
    return sortResults(this.filteredResults, this.sort, this.sortAscending);
  }

  @computed('sortedFilteredResults', 'page')
  get displayingResults() {
    return this._getResultsUpToPage(this.sortedFilteredResults, this.page);
  }

  @(task(function* () {
    let query = this.cleanedSearchInput;
    this.set('results', null);
    this.set('page', 1);

    if (!this.queryIsValid) {
      return;
    }

    this.metrics.trackEvent({
      category: 'Code Search',
      action: 'Search',
      label: query,
    });

    this.set('codeQuery', query);
    let results = yield this.get('codeSearch.addons').perform(
      query,
      this.regex
    );
    this.set('quotedLastSearch', quoteSearchTerm(query, this.regex));

    this.set('results', results);
  }).restartable())
  search;

  @(task(function* (fileFilter) {
    yield timeout(250);

    if (!isEmpty(fileFilter)) {
      this.set('fileFilter', fileFilter);
    }
  }).restartable())
  applyFileFilter;

  @action
  clearFileFilter() {
    this.set('page', 1);
    this.set('fileFilter', null);
  }

  _getResultsUpToPage(results, page) {
    if (!results || !results.length) {
      return null;
    }

    return results.slice(0, page * PageSize);
  }

  @computed('displayingResults.length', 'filteredResults.length')
  get canViewMore() {
    return (
      this.get('displayingResults.length') < this.get('filteredResults.length')
    );
  }

  @action
  viewMore() {
    this.set('page', this.page + 1);
  }

  @action
  sortBy(key) {
    let oldKey = this.sort;
    if (oldKey === key || this.sortAscending !== defaultSortAscendingFor(key)) {
      this.set('sortAscending', !this.sortAscending);
    }

    this.set('sort', key);
  }

  focus() {
    document.querySelector(this.focusNode).focus();
  }

  @readOnly('applyFileFilter.isRunning')
  isUpdatingResults;

  @readOnly('applyFileFilter.isRunning')
  isUpdatingFilter;

  @action
  clearSearch() {
    this.set('codeQuery', '');
    this.set('searchInput', '');
    this.set('results', null);
    this.set('page', 1);
    scheduleOnce('afterRender', this, 'focus');
  }
}

function sortResults(results, sort, sortAscending) {
  let sorted;

  if (sort === 'usages') {
    sorted = asArray(results).slice().sort((a, b) => compare(get(a, 'count'), get(b, 'count')));
  }

  if (sort === 'name') {
    sorted = asArray(results).slice().sort((a, b) => compare(get(a, 'addon.name'), get(b, 'addon.name')));
  }

  if (sort === 'score') {
    sorted = asArray(results).slice().sort((a, b) => compare(get(a, 'addon.score'), get(b, 'addon.score')));
  }

  if (sort === 'updated') {
    sorted = asArray(results).slice().sort((a, b) => compare(get(a, 'addon.latestVersionDate'), get(b, 'addon.latestVersionDate')));
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
  } catch (e) {
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
        count: filteredFiles.length,
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

import classic from 'ember-classic-decorator';
import { classNames } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { readOnly, notEmpty, sum, mapBy } from '@ember/object/computed';
import { scheduleOnce } from '@ember/runloop';
import Component from '@ember/component';
import { isEmpty, isBlank } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';
import config from 'ember-observer/config/environment';

const PageSize = config.codeSearchPageSize;

@classic
@classNames('code-search')
export default class CodeSearchComponent extends Component {
  @service
  @service
  metrics;

  @service
  @service
  store;

  @service
  @service
  codeSearch;

  codeQuery = null;
  sort = null;
  sortAscending = null;
  fileFilter = null;
  quotedLastSearch = null;
  page = 1;
  focusNode = '#code-search-input';

  @mapBy('results', 'count')
  usageCounts;

  @sum('usageCounts')
  totalUsageCount;

  @mapBy('filteredResults', 'count')
  filteredUsageCounts;

  @sum('filteredUsageCounts')
  totalFilteredUsageCount;

  @notEmpty('fileFilter')
  isFilterApplied;

  @computed('isFilterApplied', 'isUpdatingFilter')
  get isDisplayingFilteredResults() {
    return this.get('isFilterApplied') && !this.get('isUpdatingFilter');
  }

  init() {
    super.init(...arguments);
    this.set('searchInput', this.get('codeQuery') || '');
    this.get('search').perform();
  }

  @computed('results.length', 'search.isIdle')
  get hasSearchedAndNoResults() {
    return this.get('results.length') === 0 && this.get('search.isIdle');
  }

  @computed('searchInput')
  get queryIsValid() {
    let input = this.get('searchInput');
    return !(isBlank(input) || input.length < 2);
  }

  @computed('searchInput')
  get cleanedSearchInput() {
    return this.get('searchInput').trim();
  }

  @computed('results', 'fileFilter')
  get filteredResults() {
    if (this.get('fileFilter')) {
      return filterByFilePath(this.get('results'), this.get('fileFilter'));
    } else {
      return this.get('results');
    }
  }

  @computed('filteredResults', 'sort', 'sortAscending')
  get sortedFilteredResults() {
    return sortResults(this.get('filteredResults'), this.get('sort'), this.get('sortAscending'));
  }

  @computed('sortedFilteredResults', 'page')
  get displayingResults() {
    return this._getResultsUpToPage(this.get('sortedFilteredResults'), this.get('page'));
  }

  @task
  search;

  @task
  applyFileFilter;

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
    return this.get('displayingResults.length') < this.get('filteredResults.length');
  }

  viewMore() {
    this.set('page', this.get('page') + 1);
  }

  sortBy(key) {
    let oldKey = this.get('sort');
    if (oldKey === key || this.get('sortAscending') !== defaultSortAscendingFor(key)) {
      this.set('sortAscending', !this.get('sortAscending'));
    }

    this.set('sort', key);
  }

  focus() {
    this.$(this.get('focusNode')).focus();
  }

  @readOnly('applyFileFilter.isRunning')
  isUpdatingResults;

  @readOnly('applyFileFilter.isRunning')
  isUpdatingFilter;

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

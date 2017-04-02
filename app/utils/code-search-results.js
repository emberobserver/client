import Ember from 'ember';
import { task } from 'ember-concurrency';
import config from 'ember-addon-review/config/environment';

const {
  computed,
  inject,
  isEmpty,
  isPresent,
  Object,
  set
} = Ember;

export default Object.extend({

  store: inject.service(),

  init() {
    this._super(...arguments);
    this.set('displayingResults', []);
    this.set('lastResultPageDisplaying', 0);
    this._sortAndFilterRawResults();
  },

  _sortAndFilterRawResults() {
    let sortKey = this.get('sortKey');
    let fileFilter = this.get('fileFilter');
    let results = this.get('rawResults');

    if (isPresent(fileFilter)) {
      results = filterByFilePath(results, fileFilter);
    }
    if (isPresent(sortKey)) {
      results = sortResults(results, sortKey);
    } else {
      this.set('sortKey', 'name');
    }
    this.set('sortedFilteredResults', results);
  },

  isUpdating: computed.or('filter.isRunning', 'clearFilter.isRunning'),

  length: computed.readOnly('rawResults.length'),

  usageCounts: computed.mapBy('rawResults', 'count'),

  totalUsageCount: computed.sum('usageCounts'),

  filteredLength: computed.readOnly('sortedFilteredResults.length'),

  filteredUsageCounts: computed.mapBy('sortedFilteredResults', 'count'),

  filteredTotalUsageCount: computed.sum('filteredUsageCounts'),

  nextPageToDisplay: computed('lastResultPageDisplaying', function() {
    return this.get('lastResultPageDisplaying') + 1;
  }),

  hasMoreToView: computed('sortedFilteredResults.length', 'displayingResults.length', function() {
    return this.get('displayingResults.length') < this.get('sortedFilteredResults.length');
  }),

  fetchNextPage: task(function* () {
    if (!this.get('rawResults') || !this.get('rawResults.length')) {
      return;
    }

    let nextPage = this.get('nextPageToDisplay');
    let nextPageOfResults = pageOfResults(this.get('sortedFilteredResults'), nextPage);
    yield this._fetchAddonsAndAssignToResults(nextPageOfResults);

    this.get('displayingResults').pushObjects(nextPageOfResults);
    this.set('lastResultPageDisplaying', nextPage);
  }),

  sort: task(function* (key) {
    if (!this.get('rawResults') || !this.get('rawResults.length')) {
      return;
    }

    this.set('sortKey', key);
    let sortedResults = sortResults(this.get('sortedFilteredResults'), key);
    this.set('sortedFilteredResults', sortedResults);
    yield this.get('resetToFirstPageOfResults').perform();
  }),

  resetToFirstPageOfResults: task(function* () {
    let firstPageOfResults = pageOfResults(this.get('sortedFilteredResults'), 1);
    yield this._fetchAddonsAndAssignToResults(firstPageOfResults);

    this.set('displayingResults', firstPageOfResults);
    this.set('lastResultPageDisplaying', 1);
  }),

  _fetchAddonsAndAssignToResults(pageOfResults) {
    let names = pageOfResults.mapBy('addonName');

    return this.get('store').query('addon', { filter: { name: names.join(',') }, include: 'categories' }).then((addons) => {
      pageOfResults.forEach((result) => {
        set(result, 'addon', addons.findBy('name', result.addonName));
      });
    });
  },

  filter: task(function* (filterTerm) {
    if (isEmpty(filterTerm)) {
      return;
    }
    this.set('filterTerm', filterTerm);
    let filteredResults = filterByFilePath(this.get('rawResults'), filterTerm);
    let sortedFilteredResults = sortResults(filteredResults, this.get('sortKey'));
    this.set('sortedFilteredResults', sortedFilteredResults);
    yield this.get('resetToFirstPageOfResults').perform();
  }),

  clearFilter: task(function* () {
    this.set('filterTerm', null);

    let sortedResults = sortResults(this.get('rawResults'), this.get('sortKey'));
    this.set('sortedFilteredResults', sortedResults);
    yield this.get('resetToFirstPageOfResults').perform();
  })
});

function sortResults(results, sortKey) {
  if (sortKey === 'usages') {
    return results.sortBy('count').reverse();
  }

  if (sortKey === 'name') {
    return results.sortBy('addonName');
  }
}

function filterByFilePath(results, filterTerm) {
  let filteredList = [];
  results.forEach((result) => {
    let filteredFiles = result.files.filter((filePath) => {
      return filePath.includes(filterTerm);
    });
    if (filteredFiles.length > 0) {
      filteredList.push({
        addonName: result.addonName,
        addon: results.addon,
        files: filteredFiles,
        count: filteredFiles.length
      });
    }
  });
  return filteredList;
}

function pageOfResults(results, page) {
  return results.slice((page - 1) * config.pageSize, page * config.pageSize);
}

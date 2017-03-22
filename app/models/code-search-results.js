import Ember from 'ember';
import { task } from 'ember-concurrency';

const {
  computed,
  inject,
  isEmpty,
  Object
} = Ember;

const PageSize = 50;

export default Object.extend({

  store: inject.service(),

  init() {
    this._super(...arguments);
    this._doInitialSort();
    this.set('displayingResults', []);
    this.set('lastResultPageDisplaying', 0);
  },

  _doInitialSort() {
    let sort = this.get('initialSort');
    if (isEmpty(sort)) {
      this.set('sortedResults', this.get('rawResults'));
    } else {
      this.sortResults(sort);
    }
  },

  length: computed.readOnly('rawResults.length'),

  usageCounts: computed.mapBy('rawResults', 'count'),

  totalUsageCount: computed.sum('usageCounts'),

  nextPageToDisplay: computed('lastResultPageDisplaying', function() {
    return this.get('lastResultPageDisplaying') + 1;
  }),

  hasMoreToView: computed('length', 'displayingResults.length', function() {
    return this.get('displayingResults.length') < this.get('length');
  }),

  fetchNextPage: task(function* () {
    if (!this.get('rawResults') || !this.get('rawResults.length')) {
      return;
    }

    let nextPage = this.get('nextPageToDisplay');
    let nextPageOfResults = pageOfResults(this.get('sortedResults'), nextPage);
    yield this._fetchAddonsAndAssignToResults(nextPageOfResults);

    this.get('displayingResults').pushObjects(nextPageOfResults);
    this.set('lastResultPageDisplaying', nextPage);
  }),

  sort: task(function* (key) {
    if (!this.get('rawResults') || !this.get('rawResults.length')) {
      return;
    }

    this.sortResults(key);
    let firstPageOfResults = pageOfResults(this.get('sortedResults'), 1);
    yield this._fetchAddonsAndAssignToResults(firstPageOfResults);

    this.set('displayingResults', firstPageOfResults);
    this.set('lastResultPageDisplaying', 1);
  }),

  _fetchAddonsAndAssignToResults(pageOfResults) {
    let names = pageOfResults.mapBy('addonName');

    return this.get('store').query('addon', { filter: { name: names.join(',') }, include: 'categories' }).then((addons) => {
      pageOfResults.forEach((result) => {
        Ember.set(result, 'addon', addons.findBy('name', result.addonName));
      });
    });
  },

  sortResults(sort) {
    if (sort === 'usages') {
      this.set('sortedResults', this.get('rawResults').sortBy('count').reverse());
    }

    if (sort === 'name') {
      this.set('sortedResults', this.get('rawResults').sortBy('addonName'));
    }
  }
});

function pageOfResults(results, page) {
  return results.slice((page - 1) * PageSize, page * PageSize);
}

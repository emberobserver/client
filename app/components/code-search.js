import Ember from 'ember';
import { task } from 'ember-concurrency';

const {
  computed,
  inject,
  getOwner
} = Ember;

const PageSize = 50;

const Results = Ember.Object.extend({

  init() {
    this._super(...arguments);
    this.set('lastResultPageDisplaying', 1);
  },

  displayingResults: null,

  length: computed.readOnly('rawResults.length'),

  usageCounts: computed.mapBy('rawResults', 'count'),

  totalUsageCount: computed.sum('usageCounts'),

  nextPageToDisplay: computed('lastResultPageDisplaying', function() {
    return this.get('lastResultPageDisplaying') + 1;
  }),

  hasMoreToView: computed('length', 'displayingResults.length', function() {
    return this.get('displayingResults.length') < this.get('length');
  }),

  pageAdded(moreAddons) {
    this.get('displayingResults').pushObjects(moreAddons);
    this.set('lastResultPageDisplaying', this.get('nextPageToDisplay'));
  },

  addonOrderChanged(sortedAddons) {
    this.set('displayingResults', sortedAddons);
    this.set('lastResultPageDisplaying', 1);
  }
});

export default Ember.Component.extend({
  metrics: inject.service(),

  store: inject.service(),

  codeQuery: null,

  sort: null,

  results: null,

  classNames: ['code-search'],

  focusNode: '#code-search-input',

  codeSearch: inject.service(),

  totalUsageCount: computed.readOnly('results.totalUsageCount'),

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
    return !(Ember.isBlank(input) || input.length < 2);
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

    let firstPageOfResults = yield this._fetchPageOfAddonResults(results, 1, this.get('sort'));
    let resultsObject = Results.create(getOwner(this).ownerInjection(), {
      rawResults: results,
      displayingResults: firstPageOfResults
    });
    this.set('results', resultsObject);
  }).restartable(),

  _fetchPageOfAddonResults(results, page, sort) {
    if (!results || !results.length) {
      return Ember.RSVP.resolve(null);
    }

    let sortedResults = sortResults(results, sort);
    let pageOfResults = sortedResults.slice((page - 1) * PageSize, page * PageSize);
    let names = pageOfResults.mapBy('addonName');
    return this.get('store').query('addon', { filter: { name: names.join(',') }, include: 'categories' }).then((addons) => {
      return pageOfResults.map((result) => {
        return {
          addon: addons.findBy('name', result.addonName),
          count: result.count
        };
      });
    });
  },

  canViewMore: computed.readOnly('results.hasMoreToView'),

  viewMore: task(function* () {
    let pageToFetch = this.get('results.nextPageToDisplay');
    let moreAddons = yield this._fetchPageOfAddonResults(this.get('results.rawResults'), pageToFetch, this.get('sort'));
    this.get('results').pageAdded(moreAddons);
  }),

  sortBy: task(function* (key) {
    this.set('sort', key);
    let sortedAddons = yield this._fetchPageOfAddonResults(this.get('results.rawResults'), 1, key);
    this.get('results').addonOrderChanged(sortedAddons);
  }),

  focus() {
    this.$(this.get('focusNode')).focus();
  },

  actions: {
    clearSearch() {
      this.set('codeQuery', '');
      this.set('searchInput', '');
      this.set('results', null);
      Ember.run.scheduleOnce('afterRender', this, 'focus');
    }
  }
});

function sortResults(results, sort) {
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

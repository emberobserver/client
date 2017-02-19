import Ember from 'ember';
import { task } from 'ember-concurrency';
import FocusableComponent from 'ember-component-focus/mixins/focusable-component';

const { computed, inject } = Ember;

const PageSize = 50;

export default Ember.Component.extend(FocusableComponent, {
  metrics: inject.service(),

  store: inject.service(),

  codeQuery: null,
  sort: null,

  classNames: ['code-search'],

  focusNode: '#code-search-input',

  codeSearch: inject.service(),

  usageCounts: computed.mapBy('results.rawResults', 'count'),

  totalUsageCount: computed.sum('usageCounts'),

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
    this.set('results',
      {
        displayingResults: firstPageOfResults,
        lastResultPageDisplaying: 1,
        rawResults: results,
        length: results.length
      });
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

  canViewMore: computed('results.displayingResults', function() {
    return this.get('results.displayingResults.length') < this.get('results.length');
  }),

  viewMore: task(function* () {
    let pageToFetch = this.get('results.lastResultPageDisplaying') + 1;
    let moreAddons = yield this._fetchPageOfAddonResults(this.get('results.rawResults'), pageToFetch, this.get('sort'));
    this.get('results.displayingResults').pushObjects(moreAddons);
    this.set('results.lastResultPageDisplaying', pageToFetch);
  }),

  sortBy: task(function* (key) {
    this.set('sort', key);
    let sortedAddons = yield this._fetchPageOfAddonResults(this.get('results.rawResults'), 1, key);
    this.set('results.displayingResults', sortedAddons);
    this.set('results.lastResultPageDisplaying', 1);
  }),

  actions: {
    clearSearch() {
      this.set('codeQuery', '');
      this.set('searchInput', '');
      this.set('results', null);
      this.focus();
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

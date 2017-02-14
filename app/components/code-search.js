import Ember from 'ember';
import { task } from 'ember-concurrency';
import FocusableComponent from 'ember-component-focus/mixins/focusable-component';

const { computed, inject } = Ember;

export default Ember.Component.extend(FocusableComponent, {
  metrics: inject.service(),

  visibleResultCount: 50,

  classNames: ['code-search'],

  focusNode: '#code-search-input',

  codeSearch: inject.service(),

  usageCounts: computed.mapBy('results', 'count'),

  totalUsageCount: computed.sum('usageCounts'),

  sortedResults: computed.sort('results', 'sortDefinition'),

  sortDefinition: computed('sort', function() {
    let sorts = {
      name: ['addon.name'],
      usages: ['count:desc', 'addon.name']
    };
    return sorts[this.get('sort')];
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
    let addons = yield this.get('codeSearch').addons(query, this.get('regex'));
    this.set('quotedLastSearch', quoteSearchTerm(query, this.get('regex')));
    this.set('results', addons);
  }).restartable(),

  visibleResults: computed('visibleResultCount', 'sortedResults', function() {
    return this.get('sortedResults').slice(0, this.get('visibleResultCount'));
  }),

  canViewMore: computed('visibleResultCount', 'results', function() {
    return this.get('visibleResultCount') < this.get('results.length');
  }),

  actions: {
    clearSearch() {
      this.set('codeQuery', '');
      this.set('searchInput', '');
      this.set('results', null);
      this.focus();
    },

    viewMore() {
      let newResultCount = this.get('visibleResultCount') + 50;
      this.set('visibleResultCount', newResultCount);
    },

    sortBy(key) {
      this.set('sort', key);
    }
  }
});

function quoteSearchTerm(searchTerm, isRegex) {
  let character = isRegex ? '/' : '"';
  return `${character}${searchTerm}${character}`;
}

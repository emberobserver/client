import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import CodeSearchResults from 'ember-addon-review/utils/code-search-results';

const {
  computed,
  inject,
  getOwner
} = Ember;

export default Ember.Component.extend({
  metrics: inject.service(),

  codeQuery: null,

  sort: null,

  fileFilter: null,

  results: null,

  classNames: ['code-search'],

  focusNode: '#code-search-input',

  codeSearch: inject.service(),

  showFilteredUsages: computed('results.isFilterApplied', 'results.isUpdating', function() {
    return this.get('results.isFilterApplied') && !this.get('results.isUpdating');
  }),

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

    let resultsObject = CodeSearchResults.create(getOwner(this).ownerInjection(), {
      rawResults: results, sortKey: this.get('sort'), filterTerm: this.get('fileFilter')
    });
    yield resultsObject.get('fetchNextPage').perform();
    this.set('results', resultsObject);
  }).restartable(),

  canViewMore: computed.readOnly('results.hasMoreToView'),

  viewMore: task(function* () {
    yield this.get('results.fetchNextPage').perform();
  }),

  sortBy: task(function* (key) {
    yield this.get('results.sort').perform(key);
    this.set('sort', key);
  }),

  applyFileFilter: task(function* (fileFilter) {
    yield timeout(500);

    this.set('fileFilter', fileFilter);
    yield this.get('results.filter').perform(fileFilter);
  }).restartable(),

  clearFileFilter: task(function* () {
    this.set('fileFilter', null);
    yield this.get('results.clearFilter').perform();
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

function quoteSearchTerm(searchTerm, isRegex) {
  let character = isRegex ? '/' : '"';
  return `${character}${searchTerm}${character}`;
}

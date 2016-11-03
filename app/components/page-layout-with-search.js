import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import FocusableComponent from 'ember-component-focus/mixins/focusable-component';

const MIN_LENGTH_SEARCH = 2;

export default Ember.Component.extend(FocusableComponent, {
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  searchService: Ember.inject.service('search'),
  routing: Ember.inject.service('-routing'),
  metrics: Ember.inject.service(),
  focusNode: '#search-input',
  showCategories: true,
  init() {
    this._super(...arguments);
    this.get('search').perform(this.get('query'));
  },
  categories: Ember.computed(function() {
    return this.get('store').peekAll('category');
  }),
  hasSearchedAndNoResults: Ember.computed('queryIsValid', 'results.length', 'search.isIdle', function() {
    return this.get('queryIsValid') && !this.get('results.length') && this.get('search.isIdle');
  }),
  queryIsValid: Ember.computed('query', function() {
    let emMatcher = /(^e$|^em$|^emb$|^embe$|^ember$|^ember-$)/;
    let query = this.get('query');
    return !(Ember.isBlank(query) || query.length < MIN_LENGTH_SEARCH || emMatcher.test(query));
  }),
  search: task(function * (query) {
    this.set('query', query.trim());
    if (!this.get('queryIsValid')) {
      this.set('_results', null);
      return;
    }

    yield timeout(250);

    this.get('metrics').trackEvent({ category: 'Search', action: `Search on ${document.location.pathname}`, label: this.get('query') });

    let results = yield this.get('searchService').search(this.get('query'));
    this.set('_results', results);
  }).restartable(),
  results: Ember.computed('query', '_results', function() {
    if (this.get('queryIsValid')) {
      return this.get('_results');
    }
    return null;
  }),
  clearSearch() {
    this.get('metrics').trackEvent({ category: 'Clear Search', action: `Clear on ${document.location.pathname}` });

    this.set('query', '');
    this.set('_results', null);
    this.focus();
  },
  logoutUser() {
    this.get('session').close().finally(() => {
      this.get('routing').transitionTo('index');
    });
  }
});

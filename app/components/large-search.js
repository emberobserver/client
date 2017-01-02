import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import FocusableComponent from 'ember-component-focus/mixins/focusable-component';

export default Ember.Component.extend(FocusableComponent, {
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  searchService: Ember.inject.service('search'),
  routing: Ember.inject.service('-routing'),
  metrics: Ember.inject.service(),
  focusNode: '#search-input',
  init() {
    this._super(...arguments);
    this.get('search').perform(this.get('query'));
  },
  hasSearchedAndNoResults: Ember.computed('queryIsValid', 'results.length', 'search.isIdle', function() {
    return this.get('queryIsValid') && !this.get('results.length') && this.get('search.isIdle');
  }),
  queryIsValid: Ember.computed('query', function() {
    let emMatcher = /(^e$|^em$|^emb$|^embe$|^ember$|^ember-$)/;
    let query = this.get('query');
    return !(Ember.isBlank(query) || query.length < 3 || emMatcher.test(query));
  }),
  search: task(function * (query) {
    this.set('query', query.trim());
    if (!this.get('queryIsValid')) {
      this.set('_results', null);
      return;
    }

    yield timeout(250);

    this.get('metrics').trackEvent({ category: 'Search', action: `Search on /`, label: this.get('query') });

    let results = yield this.get('searchService').search(this.get('query'), { includeReadmes: this.get('searchReadmes') });
    this.set('_results', results);
  }).restartable(),
  toggleReadmeSearch: task(function * () {
    this.toggleProperty('searchReadmes');
    yield this.get('search').perform(this.get('query'));
  }),
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
  }
});

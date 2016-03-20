import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import FocusableComponent from 'ember-component-focus/mixins/focusable-component';

export default Ember.Component.extend(FocusableComponent, {
  store: Ember.inject.service(),
  searchService: Ember.inject.service('search'),
  focusNode: '#search-input',
  didInsertElement() {
    this.focus();
  },
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
    if(!this.get('queryIsValid')) {
      this.set('results', null);
      return;
    }

    yield timeout(250);

    let results = yield this.get('searchService').search(query);
    this.set('results', results);
  }).restartable(),
  clearSearch() {
    this.set('query', '');
    this.set('results', null);
  }
});


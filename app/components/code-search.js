import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import FocusableComponent from 'ember-component-focus/mixins/focusable-component';

export default Ember.Component.extend(FocusableComponent, {
  classNames: ['code-search'],

  focusNode: '#code-search-input',

  codeSearch: Ember.inject.service(),

  hasSearchedAndNoResults: Ember.computed('queryIsValid', 'results.length', 'search.isIdle', function() {
    return this.get('queryIsValid') && !this.get('results.length') && this.get('search.isIdle');
  }),
  queryIsValid: Ember.computed('query', function() {
    let query = this.get('query');
    return !(Ember.isBlank(query) || query.length < 3);
  }),
  search: task(function * (query) {
    this.set('query', query.trim());
    this.set('results', null);
    if (!this.get('queryIsValid')) {
      return;
    }

    yield timeout(1000);

    let addons = yield this.get('codeSearch').addons(query);
    this.set('results', addons);
  }).restartable(),

  actions: {
    clearSearch() {
      this.set('query', '');
      this.set('results', null);
      this.focus();
    }
  }
});

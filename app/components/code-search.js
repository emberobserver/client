import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import FocusableComponent from 'ember-component-focus/mixins/focusable-component';

const {computed, inject} = Ember;

export default Ember.Component.extend(FocusableComponent, {
  visibleResultCount: 50,

  classNames: ['code-search'],

  focusNode: '#code-search-input',

  codeSearch: inject.service(),

  hasSearchedAndNoResults: computed('queryIsValid', 'results.length', 'search.isIdle', function () {
    return this.get('queryIsValid') && !this.get('results.length') && this.get('search.isIdle');
  }),
  queryIsValid: computed('query', function () {
    let query = this.get('query');
    return !(Ember.isBlank(query) || query.length < 3);
  }),
  search: task(function * (query) {
    this.set('query', query.trim());
    this.set('results', null);
    if (!this.get('queryIsValid')) {
      return;
    }

    yield timeout(500);

    let addons = yield this.get('codeSearch').addons(query);
    this.set('results', addons);
  }).restartable(),

  visibleResults: computed('visibleResultCount', 'results', function () {
    return this.get('results').slice(0, this.get('visibleResultCount'));
  }),

  canViewMore: computed('visibleResultCount', 'results', function () {
    return this.get('visibleResultCount') < this.get('results.length');
  }),

  actions: {
    clearSearch() {
      this.set('query', '');
      this.set('results', null);
      this.focus();
    },

    viewMore() {
      let newResultCount = this.get('visibleResultCount') + 50;
      this.set('visibleResultCount', newResultCount);
    }
  }
});

import Ember from 'ember';
import { task } from 'ember-concurrency';
import FocusableComponent from 'ember-component-focus/mixins/focusable-component';

const {computed, inject} = Ember;

export default Ember.Component.extend(FocusableComponent, {
  visibleResultCount: 50,

  classNames: ['code-search'],

  focusNode: '#code-search-input',

  codeSearch: inject.service(),

  init() {
    this._super(...arguments);
    this.set('searchInput', this.get('codeQuery') || '');
    this.get('search').perform();
  },

  hasSearchedAndNoResults: computed('results.length', 'search.isIdle', function () {
    return this.get('results.length') === 0 && this.get('search.isIdle');
  }),
  queryIsValid: computed('searchInput', function () {
    let input = this.get('searchInput');
    return !(Ember.isBlank(input) || input.length < 3);
  }),
  search: task(function * () {
    let query = this.get('searchInput').trim();
    this.set('results', null);

    if (!this.get('queryIsValid')) {
      return;
    }

    this.set('codeQuery', query);
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
      this.set('codeQuery', '');
      this.set('results', null);
      this.focus();
    },

    viewMore() {
      let newResultCount = this.get('visibleResultCount') + 50;
      this.set('visibleResultCount', newResultCount);
    }
  }
});

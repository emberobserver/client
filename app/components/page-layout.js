import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

const { isBlank } = Ember;

export default Ember.Component.extend({
  showHeaderSearch: true,
  searchTerm: null,
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  routing: Ember.inject.service(),
  metrics: Ember.inject.service(),
  searchService: Ember.inject.service('search'),
  categories: Ember.computed(function() {
    return this.get('store').peekAll('category');
  }),
  goSearch(term) {
    if (!isBlank(term)) {
      this.get('metrics').trackEvent({ category: 'Header search', action: `Search on ${document.location.pathname}`, label: this.get('searchTerm') });
      this.get('routing').transitionTo('index', { queryParams: { query: term } });
    }
  },
  searchForAddons: task(function* (term) {
    if (term.length === 0) {
      return Ember.RSVP.resolve([]);
    }

    yield timeout(250);

    this.get('metrics').trackEvent({ category: 'Header autocomplete', action: `Autocomplete on ${document.location.pathname}`, label: term });
    let results = yield this.get('searchService.searchAddonNames').perform(term);
    let limitedResults = results.slice(0, 5);
    if (!limitedResults.length) {
      return [{
        noResults: true,
        isFullSearchLink: true
      }];
    }

    limitedResults.insertAt(1, { isFullSearchLink: true });
    return limitedResults;
  }).restartable(),
  goToAddon: task(function* (selected, options) {
    if (selected.isFullSearchLink) {
      this.goSearch(options.searchText);
    } else {
      this.set('selectedAddon', selected);
      yield this.get('routing').transitionTo('addons.show', selected);
      this.set('selectedAddon', null);
    }
  }),
  logoutUser() {
    this.get('session').close().finally(() => {
      this.get('routing').transitionTo('index');
    });
  }
});

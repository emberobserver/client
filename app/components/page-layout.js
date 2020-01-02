import { resolve } from 'rsvp';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { isBlank } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  showHeaderSearch: true,
  searchTerm: null,
  store: service(),
  session: service(),
  routing: service(),
  metrics: service(),
  searchService: service('search'),
  categories: computed(function() {
    return this.store.peekAll('category');
  }),
  goSearch(term) {
    if (!isBlank(term)) {
      this.metrics.trackEvent({ category: 'Header search', action: `Search on ${document.location.pathname}`, label: this.searchTerm });
      this.routing.transitionTo('index', { queryParams: { query: term } });
    }
  },
  searchForAddons: task(function* (term) {
    if (term.length === 0) {
      return resolve([]);
    }

    yield timeout(250);

    this.metrics.trackEvent({ category: 'Header autocomplete', action: `Autocomplete on ${document.location.pathname}`, label: term });
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
      yield this.routing.transitionTo('addons.show', selected);
      this.set('selectedAddon', null);
    }
  }),
  logoutUser() {
    this.session.close().finally(() => {
      this.routing.transitionTo('index');
    });
  }
});

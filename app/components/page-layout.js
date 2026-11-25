import { action, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { resolve } from 'rsvp';
import Component from '@glimmer/component';
import { isBlank } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';
import { cached, tracked } from '@glimmer/tracking';

export default class PageLayout extends Component {
  @tracked selectedAddon;

  get showHeaderSearch() {
    return this.args.showHeaderSearch ?? true;
  }

  searchTerm = null;

  @service
  store;

  @service
  session;

  @service
  router;

  @service
  metrics;

  @service('search')
  searchService;

  @cached
  get categories() {
    return this.store.peekAll('category');
  }

  goSearch(term) {
    if (!isBlank(term)) {
      this.metrics.trackEvent({
        category: 'Header search',
        action: `Search on ${document.location.pathname}`,
        label: this.searchTerm,
      });
      this.router.transitionTo('index', { queryParams: { query: term } });
    }
  }

  @(task(function* (term) {
    if (term.length === 0) {
      return resolve([]);
    }

    yield timeout(250);

    this.metrics.trackEvent({
      category: 'Header autocomplete',
      action: `Autocomplete on ${document.location.pathname}`,
      label: term,
    });
    let results = yield get(this, 'searchService.searchAddonNames').perform(
      term
    );
    let limitedResults = results.slice(0, 5);
    if (!limitedResults.length) {
      return [
        {
          noResults: true,
          isFullSearchLink: true,
        },
      ];
    }

    limitedResults.insertAt(1, { isFullSearchLink: true });
    return limitedResults;
  }).restartable())
  searchForAddons;

  @task(function* (selected, options) {
    if (selected.isFullSearchLink) {
      this.goSearch(options.searchText);
    } else {
      this.selectedAddon = selected;
      yield this.router.transitionTo('addons.show', selected);
      this.selectedAddon = null;
    }
  })
  goToAddon;

  @action
  logoutUser() {
    this.session.close().finally(() => {
      this.router.transitionTo('index');
    });
  }
}

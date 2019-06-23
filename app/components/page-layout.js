import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { resolve } from 'rsvp';
import Component from '@ember/component';
import { isBlank } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';

@classic
export default class PageLayoutComponent extends Component {
  showHeaderSearch = true;
  searchTerm = null;

  @service
  @service
  store;

  @service
  @service
  session;

  @service
  @service
  routing;

  @service
  @service
  metrics;

  @service
  @service
  searchService;

  @computed()
  get categories() {
    return this.get('store').peekAll('category');
  }

  goSearch(term) {
    if (!isBlank(term)) {
      this.get('metrics').trackEvent({ category: 'Header search', action: `Search on ${document.location.pathname}`, label: this.get('searchTerm') });
      this.get('routing').transitionTo('index', { queryParams: { query: term } });
    }
  }

  @task
  searchForAddons;

  @task
  goToAddon;

  logoutUser() {
    this.get('session').close().finally(() => {
      this.get('routing').transitionTo('index');
    });
  }
}

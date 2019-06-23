import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { hash, resolve } from 'rsvp';
import { isBlank } from '@ember/utils';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';

const PageSize = 10;

@classic
export default class LargeSearchComponent extends Component {
  @service
  @service
  store;

  @service
  @service
  session;

  @service
  @service
  searchService;

  @service
  @service
  routing;

  @service
  @service
  metrics;

  focusNode = '#search-input';

  init() {
    super.init(...arguments);
    this.get('search').perform(this.get('query'));
  }

  @computed('queryIsValid', 'results.length', 'search.isIdle')
  get hasSearchedAndNoResults() {
    return this.get('queryIsValid') && !this.get('results.length') && this.get('search.isIdle');
  }

  @computed('query')
  get queryIsValid() {
    let emMatcher = /(^e$|^em$|^emb$|^embe$|^ember$|^ember-$)/;
    let query = this.get('query');
    return !(isBlank(query) || query.length < 3 || emMatcher.test(query));
  }

  @task
  fetchMoreAddons;

  @task
  fetchMoreMaintainers;

  @task
  fetchMoreCategories;

  @task
  fetchMoreReadmes;

  @task
  search;

  @task
  toggleReadmeSearch;

  _fetchFirstPageOfResults(results) {
    let addonsPromise = this._fetchPageOfAddonResults(results.addonResults, 1);
    let categoriesPromise = this._fetchPageOfCategoryResults(results.categoryResults, 1);
    let maintainersPromise = this._fetchPageOfMaintainerResults(results.maintainerResults, 1);
    let readmePromise = this._fetchPageOfAddonResults(results.readmeResults, 1);

    return hash({
      addons: addonsPromise,
      categories: categoriesPromise,
      maintainers: maintainersPromise,
      readmes: readmePromise
    });
  }

  _fetchPageOfMaintainerResults(results, page) {
    if (!results || !results.matchCount) {
      return resolve(null);
    }
    let ids = results.matchIds.slice((page - 1) * PageSize, page * PageSize);
    return this.get('store').query('maintainer', { filter: { id: ids.join(',') }, sort: 'name' }).then((maintainers) => maintainers.toArray());
  }

  _fetchPageOfCategoryResults(results, page) {
    if (!results || !results.matchCount) {
      return resolve(null);
    }
    let ids = results.matchIds.slice((page - 1) * PageSize, page * PageSize);
    return this.get('store').query('category', { filter: { id: ids.join(',') }, sort: 'name' }).then((categories) => categories.toArray());
  }

  _fetchPageOfAddonResults(results, page) {
    if (!results || !results.matchCount) {
      return resolve(null);
    }
    let ids = results.matchIds.slice((page - 1) * PageSize, page * PageSize);
    return this.get('store').query('addon', { filter: { id: ids.join(',') }, sort: '-score', include: 'categories' }).then((addons) => addons.toArray());
  }

  @computed('query', '_results')
  get results() {
    if (this.get('queryIsValid')) {
      return this.get('_results');
    }
    return null;
  }

  focus() {
    this.$(this.get('focusNode')).focus();
  }

  clearSearch() {
    this.get('metrics').trackEvent({ category: 'Clear Search', action: `Clear on ${document.location.pathname}` });

    this.set('query', '');
    this.set('_results', null);
    scheduleOnce('afterRender', this, 'focus');
  }
}

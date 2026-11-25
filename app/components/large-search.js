import asArray from 'ember-observer/utils/as-array';
import { action, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { hash, resolve } from 'rsvp';
import { isBlank } from '@ember/utils';
import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

const PageSize = 10;

export default class LargeSearch extends Component {
  constructor(owner, args) {
    super(owner, args);
    this.search.perform(this.query);
  }

  get onQueryChange() {
    return this.args.onQueryChange;
  }

  get onSearchReadmesChange() {
    return this.args.onSearchReadmesChange;
  }

  @tracked _results;

  @service
  store;

  @service
  session;

  @service('search')
  searchService;

  @service
  metrics;

  focusNode = '#search-input';

  get hasSearchedAndNoResults() {
    return (
      this.queryIsValid &&
      !get(this, 'results.length') &&
      get(this, 'search.isIdle')
    );
  }

  get queryIsValid() {
    let emMatcher = /(^e$|^em$|^emb$|^embe$|^ember$|^ember-$)/;
    let query = this.query;
    return !(isBlank(query) || query.length < 3 || emMatcher.test(query));
  }

  @task(function* () {
    let pageToFetch = get(this, '_results.lastAddonPageDisplaying') + 1;
    let moreAddons = yield this._fetchPageOfAddonResults(
      get(this, '_results.rawResults.addonResults'),
      pageToFetch
    );
    get(this, '_results.displayingAddons').pushObjects(moreAddons);
    set(this, '_results.lastAddonPageDisplaying', pageToFetch);
  })
  fetchMoreAddons;

  @task(function* () {
    let pageToFetch = get(this, '_results.lastMaintainerPageDisplaying') + 1;
    let moreMaintainers = yield this._fetchPageOfMaintainerResults(
      get(this, '_results.rawResults.maintainerResults'),
      pageToFetch
    );
    get(this, '_results.displayingMaintainers').pushObjects(moreMaintainers);
    set(this, '_results.lastMaintainerPageDisplaying', pageToFetch);
  })
  fetchMoreMaintainers;

  @task(function* () {
    let pageToFetch = get(this, '_results.lastCategoryPageDisplaying') + 1;
    let moreCategories = yield this._fetchPageOfCategoryResults(
      get(this, '_results.rawResults.categoryResults'),
      pageToFetch
    );
    get(this, '_results.displayingCategories').pushObjects(moreCategories);
    set(this, '_results.lastCategoryPageDisplaying', pageToFetch);
  })
  fetchMoreCategories;

  @task(function* () {
    let pageToFetch = get(this, '_results.lastReadmePageDisplaying') + 1;
    let moreReadmes = yield this._fetchPageOfAddonResults(
      get(this, '_results.rawResults.readmeResults'),
      pageToFetch
    );
    get(this, '_results.displayingReadmes').pushObjects(moreReadmes);
    set(this, '_results.lastReadmePageDisplaying', pageToFetch);
  })
  fetchMoreReadmes;

  @(task(function* (query) {
    this.query = query.trim();
    if (!this.queryIsValid) {
      this._results = null;
      return;
    }

    yield timeout(250);

    this.metrics.trackEvent({
      category: 'Search',
      action: 'Search on /',
      label: this.query,
    });

    let results = yield get(this, 'searchService.search').perform(this.query, {
      includeReadmes: this.searchReadmes,
    });
    let firstPageOfResults = yield this._fetchFirstPageOfResults(results);

    this._results = {
      displayingAddons: firstPageOfResults.addons,
      lastAddonPageDisplaying: 1,
      totalAddonsCount: results.addonResults.matchCount,
      displayingCategories: firstPageOfResults.categories,
      lastCategoryPageDisplaying: 1,
      totalCategoriesCount: results.categoryResults.matchCount,
      displayingMaintainers: firstPageOfResults.maintainers,
      totalMaintainersCount: results.maintainerResults.matchCount,
      lastMaintainerPageDisplaying: 1,
      displayingReadmes: firstPageOfResults.readmes,
      readmeMatchMap: results.readmeResults.matchMap,
      totalReadmeCount: results.readmeResults.matchCount,
      lastReadmePageDisplaying: 1,
      rawResults: results,
      length: results.length,
    };
  }).restartable())
  search;

  @task(function* () {
    this.searchReadmes = !this.searchReadmes;
    yield this.search.perform(this.query);
  })
  toggleReadmeSearch;

  _fetchFirstPageOfResults(results) {
    let addonsPromise = this._fetchPageOfAddonResults(results.addonResults, 1);
    let categoriesPromise = this._fetchPageOfCategoryResults(
      results.categoryResults,
      1
    );
    let maintainersPromise = this._fetchPageOfMaintainerResults(
      results.maintainerResults,
      1
    );
    let readmePromise = this._fetchPageOfAddonResults(results.readmeResults, 1);

    return hash({
      addons: addonsPromise,
      categories: categoriesPromise,
      maintainers: maintainersPromise,
      readmes: readmePromise,
    });
  }

  _fetchPageOfMaintainerResults(results, page) {
    if (!results || !results.matchCount) {
      return resolve(null);
    }
    let ids = results.matchIds.slice((page - 1) * PageSize, page * PageSize);
    return this.store
      .query('maintainer', { filter: { id: ids.join(',') }, sort: 'name' })
      .then((maintainers) => asArray(maintainers).slice());
  }

  _fetchPageOfCategoryResults(results, page) {
    if (!results || !results.matchCount) {
      return resolve(null);
    }
    let ids = results.matchIds.slice((page - 1) * PageSize, page * PageSize);
    return this.store
      .query('category', { filter: { id: ids.join(',') }, sort: 'name' })
      .then((categories) => asArray(categories).slice());
  }

  _fetchPageOfAddonResults(results, page) {
    if (!results || !results.matchCount) {
      return resolve(null);
    }
    let ids = results.matchIds.slice((page - 1) * PageSize, page * PageSize);
    return this.store
      .query('addon', {
        filter: { id: ids.join(',') },
        sort: '-score',
        include: 'categories',
      })
      .then((addons) => asArray(addons).slice());
  }

  get results() {
    if (this.queryIsValid) {
      return this._results;
    }
    return null;
  }

  focus() {
    document.querySelector(this.focusNode).focus();
  }

  @action
  clearSearch() {
    this.metrics.trackEvent({
      category: 'Clear Search',
      action: `Clear on ${document.location.pathname}`,
    });

    this.query = '';
    this._results = null;
    scheduleOnce('afterRender', this, 'focus');
  }

  @tracked localQuery;

  get query() {
    let own = this.localQuery;

    return own && own.arg === this.args.query ? own.value : this.args.query;
  }

  set query(value) {
    if (value === this.query) return;

    this.localQuery = { arg: this.args.query, value };
    this.args.onQueryChange?.(value);
  }

  @tracked localSearchReadmes;

  get searchReadmes() {
    let own = this.localSearchReadmes;

    return own && own.arg === this.args.searchReadmes ? own.value : this.args.searchReadmes;
  }

  set searchReadmes(value) {
    if (value === this.searchReadmes) return;

    this.localSearchReadmes = { arg: this.args.searchReadmes, value };
    this.args.onSearchReadmesChange?.(value);
  }
}

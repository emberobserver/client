import asArray from 'ember-observer/utils/as-array';
import { action, get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { hash, resolve } from 'rsvp';
import { isBlank } from '@ember/utils';
import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { on } from "@ember/modifier";
import eventTargetValue from "../helpers/event-target-value.js";
import perform from "ember-concurrency/helpers/perform";
import SvgIcon from "./svg-icon.gjs";
import { Input } from "@ember/component";
import SearchResultSet from "./search-result-set.gjs";
import AddonDetails from "./addon-details.gjs";
import { get as get0, hash as hash0 } from "@ember/helper";
import domPurify from "../helpers/dom-purify.js";
import { LinkTo } from "@ember/routing";
import AddonList from "./addon-list.gjs";
import DotSpinner from "./dot-spinner.gjs";

const PageSize = 10;

export default class LargeSearch extends Component {<template><div ...attributes>
<div class="large-search with-default-styling">
  <div class="search">
    <div class="search-wrapper">
      <input type="search" placeholder="Search for addons, maintainers and categories" autocomplete="off" id="search-input" spellcheck="false" value={{@query}} {{on "input" (eventTargetValue (perform this.search))}}>
      {{#if @query}}
        <button type="button" class="close-button test-clear-search" {{on "click" this.clearSearch}}>
          <SvgIcon @iconName="close" />
        </button>
      {{/if}}
    </div>
    <div class="readme-toggle">
      <Input @type="checkbox" class="test-search-readmes" id="search-readmes" @checked={{@searchReadmes}} {{on "change" (perform this.toggleReadmeSearch)}} />
      <label for="search-readmes">Search readmes</label>
    </div>
    <h6 class="no-results {{if this.hasSearchedAndNoResults "showing"}}">No results found for "{{@query}}"</h6>
  </div>

  {{#if this.results.length}}
    <h4 class="result-info test-result-info">Results for "{{@query}}"</h4>
    <SearchResultSet @results={{this.results.displayingReadmes}} @totalCount={{this.results.totalReadmeCount}} @fetchMore={{this.fetchMoreReadmes}} @title="Readmes" @resultClass="readme-results">
      <ul class="readme-list">
        {{#each this.results.displayingReadmes as |addon|}}
          <li>
            <AddonDetails @addon={{addon}} />
            {{#each (get0 this._results.readmeMatchMap addon.id) as |match|}}
              <div class="test-readme-match text-match">
                ...{{domPurify match use-profiles=(hash0 html=true) hook="target-blank"}}...
              </div>
            {{/each}}
          </li>
        {{/each}}
      </ul>
    </SearchResultSet>
    <SearchResultSet @results={{this.results.displayingCategories}} @totalCount={{this.results.totalCategoriesCount}} @fetchMore={{this.fetchMoreCategories}} @title="Categories" @resultClass="category-results">
      <ul>
        {{#each this.results.displayingCategories as |category|}}
          <li>
            <LinkTo @route="categories.show" @model={{category.slug}}>
              <span class="bullet">&#9632;</span>
              <div>{{category.name}} ({{category.totalAddonCount}})</div>
            </LinkTo>
          </li>
        {{/each}}
      </ul>
    </SearchResultSet>
    <SearchResultSet @results={{this.results.displayingAddons}} @totalCount={{this.results.totalAddonsCount}} @fetchMore={{this.fetchMoreAddons}} @title="Addons" @resultClass="addon-results">
      <AddonList @addons={{this.results.displayingAddons}} />
    </SearchResultSet>
    <SearchResultSet @results={{this.results.displayingMaintainers}} @totalCount={{this.results.totalMaintainersCount}} @fetchMore={{this.fetchMoreMaintainers}} @title="Maintainers" @resultClass="maintainer-results">
      <ul>
        {{#each this.results.displayingMaintainers as |maintainer|}}
          <li>
            <LinkTo @route="maintainers.show" @model={{maintainer.name}}>
              <span class="bullet">&#9632;</span>
              <div>{{maintainer.name}}</div>
            </LinkTo>
          </li>
        {{/each}}
      </ul>
    </SearchResultSet>
  {{else if this.search.isRunning}}
    <DotSpinner />
  {{/if}}
</div>
</div>
</template>
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

  fetchMoreAddons = task(async () => {
    let pageToFetch = get(this, '_results.lastAddonPageDisplaying') + 1;
    let moreAddons = await this._fetchPageOfAddonResults(
      get(this, '_results.rawResults.addonResults'),
      pageToFetch
    );
    get(this, '_results.displayingAddons').pushObjects(moreAddons);
    set(this, '_results.lastAddonPageDisplaying', pageToFetch);
  });

  fetchMoreMaintainers = task(async () => {
    let pageToFetch = get(this, '_results.lastMaintainerPageDisplaying') + 1;
    let moreMaintainers = await this._fetchPageOfMaintainerResults(
      get(this, '_results.rawResults.maintainerResults'),
      pageToFetch
    );
    get(this, '_results.displayingMaintainers').pushObjects(moreMaintainers);
    set(this, '_results.lastMaintainerPageDisplaying', pageToFetch);
  });

  fetchMoreCategories = task(async () => {
    let pageToFetch = get(this, '_results.lastCategoryPageDisplaying') + 1;
    let moreCategories = await this._fetchPageOfCategoryResults(
      get(this, '_results.rawResults.categoryResults'),
      pageToFetch
    );
    get(this, '_results.displayingCategories').pushObjects(moreCategories);
    set(this, '_results.lastCategoryPageDisplaying', pageToFetch);
  });

  fetchMoreReadmes = task(async () => {
    let pageToFetch = get(this, '_results.lastReadmePageDisplaying') + 1;
    let moreReadmes = await this._fetchPageOfAddonResults(
      get(this, '_results.rawResults.readmeResults'),
      pageToFetch
    );
    get(this, '_results.displayingReadmes').pushObjects(moreReadmes);
    set(this, '_results.lastReadmePageDisplaying', pageToFetch);
  });

  search = task({ restartable: true }, async (query) => {
    this.query = query.trim();
    if (!this.queryIsValid) {
      this._results = null;
      return;
    }

    await timeout(250);

    this.metrics.trackEvent({
      category: 'Search',
      action: 'Search on /',
      label: this.query,
    });

    let results = await get(this, 'searchService.search').perform(this.query, {
      includeReadmes: this.searchReadmes,
    });
    let firstPageOfResults = await this._fetchFirstPageOfResults(results);

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
  });

  toggleReadmeSearch = task(async () => {
    this.searchReadmes = !this.searchReadmes;
    await this.search.perform(this.query);
  });

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

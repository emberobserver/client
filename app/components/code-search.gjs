import { compare } from '@ember/utils';
import { action, get } from '@ember/object';
import { service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import Component from '@glimmer/component';
import { isEmpty, isBlank } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';
import config from '#config';
import asArray from 'ember-observer/utils/as-array';
import { tracked } from '@glimmer/tracking';
import { on } from "@ember/modifier";
import preventDefault from "../helpers/prevent-default.js";
import perform from "ember-concurrency/helpers/perform";
import { Input } from "@ember/component";
import SvgIcon from "./svg-icon.gjs";
import pluralizeThis from "../helpers/pluralize-this.js";
import eventTargetValue from "../helpers/event-target-value.js";
import SortOrderOption from "./sort-order-option.gjs";
import DotSpinner from "./dot-spinner.gjs";
import AddonDetails from "./addon-details.gjs";
import AddonSourceUsages from "./addon-source-usages.gjs";

const PageSize = config.codeSearchPageSize;

export default class CodeSearch extends Component {<template><div class="code-search" ...attributes>
<h1>Code Search</h1>
<div class="search-wrapper with-default-styling">
  <form {{on "submit" (preventDefault (perform this.search))}}>
    <div class="search-wrapper-inner">
      <Input @type="search" placeholder="Search for addons containing code" autocomplete="off" id="code-search-input" spellcheck="false" @value={{this.searchInput}} />
      {{#if this.codeQuery}}
        <button type="button" class="close-button test-clear-search" {{on "click" this.clearSearch}}><SvgIcon @iconName="close" /></button>
      {{/if}}
    </div>
    <div class="search-actions">
      <Input @type="checkbox" id="regex-toggle" class="test-regex-search" @checked={{@regex}} />
      <label for="regex-toggle">Regex search</label>
      {{#if @regex}}
        <a href="https://github.com/google/re2/wiki/Syntax" class="regex-help test-regex-help" rel="noopener noreferrer" target="_blank">(re2 syntax)</a>
      {{/if}}
    </div>
    <button type="submit" class="test-submit-search button">Search</button>
  </form>
</div>

{{#if this.results.length}}
  <div class="result-details">
    <h5 class="test-last-search test-result-info">
      Results for {{this.quotedLastSearch}} &mdash; Found {{pluralizeThis this.results.length "addon"}} ({{pluralizeThis this.totalUsageCount "usage"}})
    </h5>
  </div>
  <div class="result-controls">
    <div class="filter-controls">
      <h6>Filter by file path</h6>
      <div class="filter-input">
        <input type="text" value={{this.fileFilter}} class="test-file-filter-input" {{on "input" (eventTargetValue (perform this.applyFileFilter))}}>
        {{#if this.isFilterApplied}}
          <button type="button" class="close-button test-clear-file-filter" {{on "click" this.clearFileFilter}}><SvgIcon @iconName="close" @alignBaseline={{false}} /></button>
        {{/if}}
      </div>
      {{#if this.isDisplayingFilteredResults}}
        <span class="filter-results test-filtered-result-info">
          Filtered to {{pluralizeThis this.filteredResults.length "addon"}} ({{pluralizeThis this.totalFilteredUsageCount "usage"}})
        </span>
      {{/if}}
    </div>
    <div class="sort-controls">
      <div class="button-select test-sort">
        <SortOrderOption @key="name" @selectedSort={{this.sort}} @sortAscending={{this.sortAscending}} @sortBy={{this.sortBy}}>
          Name
        </SortOrderOption>
        <SortOrderOption @key="usages" @selectedSort={{this.sort}} @sortAscending={{this.sortAscending}} @sortBy={{this.sortBy}}>
          Usages
        </SortOrderOption>
        <SortOrderOption @key="score" @selectedSort={{this.sort}} @sortAscending={{this.sortAscending}} @sortBy={{this.sortBy}}>
          Score
        </SortOrderOption>
        <SortOrderOption @key="updated" @selectedSort={{this.sort}} @sortAscending={{this.sortAscending}} @sortBy={{this.sortBy}}>
          Updated
        </SortOrderOption>
      </div>
    </div>
  </div>
  <ul class="addon-list">
    {{#if this.isUpdatingResults}}
      <DotSpinner />
    {{else}}
      {{#each this.displayingResults as |result|}}
        <li data-id={{result.addon.id}}>
          <AddonDetails @addon={{result.addon}} />
          <AddonSourceUsages @addon={{result.addon}} @count={{result.count}} @query={{this.codeQuery}} @regex={{@regex}} @fileFilter={{this.fileFilter}} />
        </li>
      {{/each}}
      {{#if this.canViewMore}}
        <button type="button" class="btn-link view-more test-view-more" {{on "click" this.viewMore}}>
          <li>See more results</li>
        </button>
      {{/if}}
    {{/if}}
  </ul>
{{else if this.search.isRunning}}
  <DotSpinner />
{{else if this.hasSearchedAndNoResults}}
  <h4 class="result-info">No addons found containing {{this.quotedLastSearch}}</h4>
{{/if}}
</div>
</template>
  constructor(owner, args) {
    super(owner, args);
    this.searchInput = this.codeQuery || '';
    this.search.perform();
  }

  get onCodeQueryChange() {
    return this.args.onCodeQueryChange;
  }

  get onSortChange() {
    return this.args.onSortChange;
  }

  get onSortAscendingChange() {
    return this.args.onSortAscendingChange;
  }

  get onRegexChange() {
    return this.args.onRegexChange;
  }

  get onFileFilterChange() {
    return this.args.onFileFilterChange;
  }

  @tracked searchInput;

  @tracked results;

  @service
  metrics;

  @service
  store;

  @service
  codeSearch;

  @tracked localCodeQuery;

  get codeQuery() {
    let own = this.localCodeQuery;

    return own && own.arg === this.args.codeQuery ? own.value : this.args.codeQuery;
  }

  set codeQuery(value) {
    if (value === this.codeQuery) return;

    this.localCodeQuery = { arg: this.args.codeQuery, value };
    this.args.onCodeQueryChange?.(value);
  }

  @tracked localSort;

  get sort() {
    let own = this.localSort;

    return own && own.arg === this.args.sort ? own.value : this.args.sort;
  }

  set sort(value) {
    if (value === this.sort) return;

    this.localSort = { arg: this.args.sort, value };
    this.args.onSortChange?.(value);
  }

  @tracked localSortAscending;

  get sortAscending() {
    let own = this.localSortAscending;

    return own && own.arg === this.args.sortAscending ? own.value : this.args.sortAscending;
  }

  set sortAscending(value) {
    if (value === this.sortAscending) return;

    this.localSortAscending = { arg: this.args.sortAscending, value };
    this.args.onSortAscendingChange?.(value);
  }

  @tracked localFileFilter;

  get fileFilter() {
    let own = this.localFileFilter;

    return own && own.arg === this.args.fileFilter ? own.value : this.args.fileFilter;
  }

  set fileFilter(value) {
    if (value === this.fileFilter) return;

    this.localFileFilter = { arg: this.args.fileFilter, value };
    this.args.onFileFilterChange?.(value);
  }

  @tracked
  quotedLastSearch = null;

  @tracked
  page = 1;

  focusNode = '#code-search-input';

  get usageCounts() {
    return asArray(get(this, 'results')).map((item) => item.count);
  }

  get totalUsageCount() {
    return asArray(get(this, 'usageCounts')).reduce((total, value) => total + value, 0);
  }

  get filteredUsageCounts() {
    return asArray(get(this, 'filteredResults')).map((item) => item.count);
  }

  get totalFilteredUsageCount() {
    return asArray(get(this, 'filteredUsageCounts')).reduce((total, value) => total + value, 0);
  }

  get isFilterApplied() {
    return !isEmpty(this.fileFilter);
  }

  get isDisplayingFilteredResults() {
    return this.isFilterApplied && !this.isUpdatingFilter;
  }

  get hasSearchedAndNoResults() {
    return get(this, 'results.length') === 0 && get(this, 'search.isIdle');
  }

  get queryIsValid() {
    let input = this.searchInput;
    return !(isBlank(input) || input.length < 2);
  }

  get cleanedSearchInput() {
    return this.searchInput.trim();
  }

  get filteredResults() {
    if (this.fileFilter) {
      return filterByFilePath(this.results, this.fileFilter);
    } else {
      return this.results;
    }
  }

  get sortedFilteredResults() {
    return sortResults(this.filteredResults, this.sort, this.sortAscending);
  }

  get displayingResults() {
    return this._getResultsUpToPage(this.sortedFilteredResults, this.page);
  }

  search = task({ restartable: true }, async () => {
    let query = this.cleanedSearchInput;
    this.results = null;
    this.page = 1;

    if (!this.queryIsValid) {
      return;
    }

    this.metrics.trackEvent({
      category: 'Code Search',
      action: 'Search',
      label: query,
    });

    this.codeQuery = query;
    let results = await get(this, 'codeSearch.addons').perform(
      query,
      this.regex
    );
    this.quotedLastSearch = quoteSearchTerm(query, this.regex);

    this.results = results;
  });

  applyFileFilter = task({ restartable: true }, async (fileFilter) => {
    await timeout(250);

    if (!isEmpty(fileFilter)) {
      this.fileFilter = fileFilter;
    }
  });

  @action
  clearFileFilter() {
    this.page = 1;
    this.fileFilter = null;
  }

  _getResultsUpToPage(results, page) {
    if (!results || !results.length) {
      return null;
    }

    return results.slice(0, page * PageSize);
  }

  get canViewMore() {
    return (
      get(this, 'displayingResults.length') < get(this, 'filteredResults.length')
    );
  }

  @action
  viewMore() {
    this.page = this.page + 1;
  }

  @action
  sortBy(key) {
    let oldKey = this.sort;
    if (oldKey === key || this.sortAscending !== defaultSortAscendingFor(key)) {
      this.sortAscending = !this.sortAscending;
    }

    this.sort = key;
  }

  focus() {
    document.querySelector(this.focusNode).focus();
  }

  get isUpdatingResults() {
    return this.applyFileFilter?.isRunning;
  }

  get isUpdatingFilter() {
    return this.applyFileFilter?.isRunning;
  }

  @action
  clearSearch() {
    this.codeQuery = '';
    this.searchInput = '';
    this.results = null;
    this.page = 1;
    scheduleOnce('afterRender', this, 'focus');
  }

  @tracked localRegex;

  get regex() {
    let own = this.localRegex;

    return own && own.arg === this.args.regex ? own.value : this.args.regex;
  }

  set regex(value) {
    if (value === this.regex) return;

    this.localRegex = { arg: this.args.regex, value };
    this.args.onRegexChange?.(value);
  }
}

function sortResults(results, sort, sortAscending) {
  let sorted;

  if (sort === 'usages') {
    sorted = asArray(results).slice().sort((a, b) => compare(get(a, 'count'), get(b, 'count')));
  }

  if (sort === 'name') {
    sorted = asArray(results).slice().sort((a, b) => compare(get(a, 'addon.name'), get(b, 'addon.name')));
  }

  if (sort === 'score') {
    sorted = asArray(results).slice().sort((a, b) => compare(get(a, 'addon.score'), get(b, 'addon.score')));
  }

  if (sort === 'updated') {
    sorted = asArray(results).slice().sort((a, b) => compare(get(a, 'addon.latestVersionDate'), get(b, 'addon.latestVersionDate')));
  }

  if (!sortAscending) {
    sorted = sorted.reverse();
  }

  return sorted;
}

function quoteSearchTerm(searchTerm, isRegex) {
  let character = isRegex ? '/' : '"';
  return `${character}${searchTerm}${character}`;
}

function filterByFilePath(results, filterTerm) {
  if (isEmpty(filterTerm)) {
    return results;
  }

  let filteredList = [];
  let filterRegex;
  try {
    filterRegex = new RegExp(filterTerm);
  } catch (e) {
    return [];
  }
  results.forEach((result) => {
    let filteredFiles = result.files.filter((filePath) => {
      return filePath.match(filterRegex);
    });
    if (filteredFiles.length > 0) {
      filteredList.push({
        addon: result.addon,
        files: filteredFiles,
        count: filteredFiles.length,
      });
    }
  });
  return filteredList;
}

function defaultSortAscendingFor(key) {
  if (key === 'name') {
    return true;
  }
  return false;
}

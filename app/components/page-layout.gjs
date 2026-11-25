import { action, get } from '@ember/object';
import { service } from '@ember/service';
import { resolve } from 'rsvp';
import Component from '@glimmer/component';
import { isBlank } from '@ember/utils';
import { task, timeout } from 'ember-concurrency';
import { cached, tracked } from '@glimmer/tracking';
import { LinkTo } from "@ember/routing";
import { hash } from "@ember/helper";
import PowerSelect from "ember-power-select/components/power-select";
import perform from "ember-concurrency/helpers/perform";
import SvgIcon from "./svg-icon.gjs";
import { on } from "@ember/modifier";
import CategoryFinder from "./category-finder.gjs";

export default class PageLayout extends Component {<template><div ...attributes>
<div class="page-layout {{unless @showCategories "categories-collapsed"}}">
  <div class="main">
    <header class="navigation">
      <LinkTo @route="index" @query={{hash query=""}} class="name">
        <img alt role="presentation" src="/ember-observer.svg">
        Ember Observer
      </LinkTo>
      {{#if this.showHeaderSearch}}
        <div class="search with-default-styling test-header-search">
          <PowerSelect @searchEnabled={{true}} @searchFieldPosition="trigger" @search={{perform this.searchForAddons}} @selected={{this.selectedAddon}} @placeholder="Search" @dropdownClass="test-header-search-dropdown" @noMatchesMessage="No matching addon names, try another search!" @onChange={{perform this.goToAddon}} as |addonName options|>
            {{#if addonName.isFullSearchLink}}
              <LinkTo @route="index" @query={{hash query=options.searchText}} class="jump-to-full-search test-search-result-jump-to-full-search-link">
                {{#if addonName.noResults}}
                  No matching addons (by name). Try a full search &raquo;
                {{else}}
                  Perform full search &raquo;
                {{/if}}
              </LinkTo>
            {{else}}
              <LinkTo @route="addons.show" @model={{addonName}} class="test-search-result-addon-link">{{addonName}}</LinkTo>
            {{/if}}
          </PowerSelect>
          {{#if this.searchForAddons.isRunning}}
            <SvgIcon @iconName="spinner" @class="circle-spinner" />
          {{/if}}
        </div>
      {{/if}}
      <nav class="links">
        <ul>
          <li>
            <LinkTo @route="code-search">Code Search</LinkTo>
          </li>
          <li>
            <LinkTo @route="about">About</LinkTo>
          </li>
          {{#if this.session.isAuthenticated}}
            <li>
              <button type="button" class="logout" {{on "click" this.logoutUser}}>Log out</button>
            </li>
          {{/if}}
        </ul>
      </nav>
    </header>
    <div class="content">
      {{yield}}
    </div>
    {{#if @showCategories}}
      <CategoryFinder class="categories-list" @categories={{this.categories}} />
    {{/if}}
  </div>
</div>
</div>
</template>
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

  searchForAddons = task({ restartable: true }, async (term) => {
    if (term.length === 0) {
      return resolve([]);
    }

    await timeout(250);

    this.metrics.trackEvent({
      category: 'Header autocomplete',
      action: `Autocomplete on ${document.location.pathname}`,
      label: term,
    });
    let results = await get(this, 'searchService.searchAddonNames').perform(
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
  });

  goToAddon = task(async (selected, options) => {
    if (selected.isFullSearchLink) {
      this.goSearch(options.searchText);
    } else {
      this.selectedAddon = selected;
      await this.router.transitionTo('addons.show', selected);
      this.selectedAddon = null;
    }
  });

  @action
  logoutUser() {
    this.session.close().finally(() => {
      this.router.transitionTo('index');
    });
  }
}

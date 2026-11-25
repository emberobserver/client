import pageTitle from "ember-page-title/helpers/page-title";
import { LinkTo } from "@ember/routing";
import InlineCategoryList from "../../components/inline-category-list.gjs";
import SortOption from "../../components/sort-option.gjs";
import pluralizeThis from "../../helpers/pluralize-this.js";
import AddonList from "../../components/addon-list.gjs";
<template>{{pageTitle @model.category.name}}
<div class="categories-show">
  <div class="details">
    <div class="category-details">
      <h1 class="test-category-header">{{@controller.category.name}}</h1>
      <p class="description test-category-description">
        {{@controller.category.description}}<br>
        {{#if @controller.category.parent}}
          Subcategory of <LinkTo @route="categories.show" @model={{@controller.category.parent.slug}} class="test-parent-category-link">{{@controller.category.parent.name}} ({{@controller.category.parent.totalAddonCount}})</LinkTo>
        {{/if}}
      </p>
      {{#if @controller.hasSubcategories}}
        <h6>Subcategories</h6>
        <InlineCategoryList @categories={{@controller.category.subcategories}} @showAddonCount={{true}} @showWithoutParent={{true}} />
      {{/if}}
    </div>
    <div class="sort-controls">
      Sort by:
      <div class="button-select">
        <SortOption @name="Score" @key="score" @selectedSort={{@controller.addonSortKey}} @sortBy={{@controller.sortBy}} data-test-sort-by="score" />
        <SortOption @name="Name" @key="name" @selectedSort={{@controller.addonSortKey}} @sortBy={{@controller.sortBy}} data-test-sort-by="name" />
        <SortOption @name="Updated" @key="latestVersionDate" @selectedSort={{@controller.addonSortKey}} @sortBy={{@controller.sortBy}} data-test-sort-by="updated" />
      </div>
    </div>
  </div>

  <div class="addons">
    <span class="addon-count test-addon-table-count">Displaying {{pluralizeThis @controller.sortedAddons.length "addon"}}</span>
    <AddonList @addons={{@controller.sortedAddons}} />
  </div>
</div>
</template>
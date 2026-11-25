import Component from '@glimmer/component';
import { get } from '@ember/object';
import { sortBy } from 'ember-observer/utils/as-array';
import CommaSeparated from "./comma-separated.gjs";
import { LinkTo } from "@ember/routing";

export default class InlineCategoryList extends Component {<template><span class="category-list test-category-list" ...attributes>
{{#each this.categoriesSortedByAddonCount as |category|}}
  <CommaSeparated @list={{this.categoriesSortedByAddonCount}} @item={{category}} as |value separator|>
    <LinkTo @route="categories.show" @model={{value.slug}}>
      {{#if @showWithoutParent}}
        {{value.name}}
      {{else}}
        {{#if value.parent}}
          {{value.parent.name}} >
        {{/if}}
        {{value.name}}
      {{~/if~}}
      {{#if @showAddonCount}}
        ({{value.totalAddonCount}})
      {{~/if~}}
      {{separator}}
    </LinkTo>
  </CommaSeparated>
{{/each}}
</span>
</template>
  categorySorting = ['totalAddonCount:desc'];

  get categoriesSortedByAddonCount() {
    return sortBy(get(this.args, 'categories'), get(this, 'categorySorting'));
  }
}

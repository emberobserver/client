import Component from '@glimmer/component';
import { get } from '@ember/object';
import { sortBy } from 'ember-observer/utils/as-array';
import PowerSelect from "ember-power-select/components/power-select";
import includes from "../helpers/includes.js";

export default class CategoryChooser extends Component {<template><div class="test-category-chooser">
  <PowerSelect @multiple={{true}} @options={{this.sortedCategories}} @selected={{this.addon.categories}} @searchField="displayName" @dropdownClass="test-category-chooser-dropdown" @placeholder="Select categories" @onChange={{@onchange}} as |category option|>
    {{category.displayName}} {{#if (not (includes option.selected category))}}{{#if category.description}}&middot; <span class="category-chooser-description">{{category.description}}</span>{{/if}}{{/if}}
  </PowerSelect>
</div>
</template>
  get categories() {
    return this.args.categories;
  }

  get addon() {
    return this.args.addon;
  }

  categorySorting = ['displayName:asc'];

  get sortedCategories() {
    return sortBy(get(this, 'categories'), get(this, 'categorySorting'));
  }
}

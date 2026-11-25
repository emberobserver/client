import Component from '@glimmer/component';
import { get } from '@ember/object';
import asArray, { sortBy } from 'ember-observer/utils/as-array';
import { LinkTo } from "@ember/routing";

export default class CategoryFinder extends Component {<template><div ...attributes>
<h2 id="title">Categories</h2>
<ul>
  {{#each this.sortedTopLevelCategories as |category|}}
    <li title={{category.description}}>
      <LinkTo @route={{this.categoryLinkRoute}} @model={{category.slug}} class="test-category">
        {{category.name}} ({{category.totalAddonCount}})
      </LinkTo>
    </li>
    {{#if category.subcategories}}
      {{#each category.subcategories as |subcategory|}}
        <li class="indent" title={{subcategory.description}}>
          <LinkTo @route={{this.categoryLinkRoute}} @model={{subcategory.slug}} class="test-subcategory">
            <span class="bullet">&#9632;</span>
            {{subcategory.name}} ({{subcategory.totalAddonCount}})
          </LinkTo>
        </li>
      {{/each}}
    {{/if}}
  {{/each}}
</ul>
</div>
</template>
  categorySorting = ['position:asc'];

  get categoryLinkRoute() {
    return this.args.categoryLinkRoute ?? 'categories.show';
  }

  get topLevelCategories() {
    return asArray(get(this.args, 'categories')).filter((item) => item.parent === null);
  }

  get sortedTopLevelCategories() {
    return sortBy(get(this, 'topLevelCategories'), get(this, 'categorySorting'));
  }
}

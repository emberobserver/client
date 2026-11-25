import { on } from "@ember/modifier";
import preventDefault from "../../../helpers/prevent-default.js";
import { Input } from "@ember/component";
import CategoryPositionDropdown from "../../../components/category-position-dropdown.gjs";
import { fn } from "@ember/helper";
import XSelect from "../../../components/x-select.gjs";
import XOption from "../../../components/x-option.gjs";
import { LinkTo } from "@ember/routing";
<template><div class="admin-categories-edit with-default-styling">
  <form {{on "submit" (preventDefault @controller.updateCategory)}}>
    <fieldset>
      <label for="name">
        Name:
      </label>
      <Input @type="text" id="name" @value={{@controller.categoryName}} />
      <br>
      <label for="description">
        Description:
      </label>
      <Input @type="text" id="description" @value={{@controller.categoryDescription}} />
      {{#if @controller.hasSiblingCategories}}
        <br>
        <label for="position">
          Position:
        </label>
        <CategoryPositionDropdown @name="position" @position={{@controller.categoryPosition}} @updatePosition={{fn (mut @controller.categoryPosition)}} @categories={{@controller.sortedSiblingCategories}} />
      {{else}}
        <Input @type="hidden" id="position" @value={{@controller.categoryPosition}} />
      {{/if}}
      <br>
      <label for="parent">
        Parent category:
      </label>
      <XSelect @name="parent" @value={{@controller.categoryParent}}>
        <XOption>(none)</XOption>
        {{#each @controller.alphabeticTopLevelCategories as |category|}}
          <XOption @value={{category.id}}>{{category.name}}</XOption>
        {{/each}}
      </XSelect>
      <br>
      <input type="submit" value="Save category">
    </fieldset>
  </form>

  {{#if @controller.isTopLevelCategory}}
    <h4>Subcategories</h4>
    {{#if @controller.subcategories}}
      <ol>
        {{#each @controller.subcategories as |category|}}
          <li><LinkTo @route="admin.categories.edit" @model={{category.slug}}>{{category.name}}</LinkTo></li>
        {{/each}}
      </ol>
    {{else}}
      This category has no subcategories.
    {{/if}}

    <form {{on "submit" (preventDefault @controller.addSubcategory)}}>
      <fieldset>
        <label for="subcategoryName">
          Name:
        </label>
        <Input @type="text" id="subcategoryName" @value={{@controller.newCategoryName}} />
        <br>
        <label for="subcategoryDescription">
          Description:
        </label>
        <Input @type="text" id="subcategoryDescription" @value={{@controller.newCategoryDescription}} />
        <br>
        <label for="subcategoryPosition">
          Position:
        </label>
        <CategoryPositionDropdown @name="subcategoryPosition" @position={{@controller.newCategoryPosition}} @categories={{@controller.subcategories}} />
        <br>
        <input type="submit" value="Add category">
      </fieldset>
    </form>
  {{/if}}
</div>
</template>
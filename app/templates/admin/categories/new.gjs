import { on } from "@ember/modifier";
import preventDefault from "../../../helpers/prevent-default.js";
import { Input } from "@ember/component";
import CategoryPositionDropdown from "../../../components/category-position-dropdown.gjs";
import { fn } from "@ember/helper";
<template><form {{on "submit" (preventDefault @controller.addCategory)}} class="with-default-styling">
  <fieldset>
    <label for="name">
      Name:
    </label>
    <Input @type="text" id="name" @value={{@controller.newCategoryName}} />
    <br>
    <label for="description">
      Description:
    </label>
    <Input @type="text" id="description" @value={{@controller.newCategoryDescription}} />
    <br>
    <label for="position">
      Position:
    </label>
    <CategoryPositionDropdown @name="position" @position={{@controller.newCategoryPosition}} @updatePosition={{fn (mut @controller.newCategoryPosition)}} @categories={{@controller.sortedTopLevelCategories}} />
    <br>
    <input type="submit" class="button" value="Add category">
  </fieldset>
</form>
</template>
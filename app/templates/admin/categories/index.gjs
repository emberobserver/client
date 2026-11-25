import { LinkTo } from "@ember/routing";
import CategoryFinder from "../../../components/category-finder.gjs";
<template><h1>Admin</h1>
<fieldset>
  <LinkTo @route="admin.categories.new">Add category</LinkTo>
</fieldset>

<CategoryFinder class="categories-list" @categoryLinkRoute="admin.categories.edit" @categories={{@controller.model}} />

</template>
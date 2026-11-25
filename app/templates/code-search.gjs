import PageLayout from "../components/page-layout.gjs";
import CodeSearch from "../components/code-search.gjs";
import { fn } from "@ember/helper";
<template><PageLayout @showCategories={{false}}>
  <CodeSearch @onCodeQueryChange={{fn (mut @controller.codeQuery)}} @onSortChange={{fn (mut @controller.sort)}} @onSortAscendingChange={{fn (mut @controller.sortAscending)}} @onRegexChange={{fn (mut @controller.regex)}} @onFileFilterChange={{fn (mut @controller.fileFilter)}} @codeQuery={{@controller.codeQuery}} @sort={{@controller.sort}} @sortAscending={{@controller.sortAscending}} @regex={{@controller.regex}} @fileFilter={{@controller.fileFilter}} />
</PageLayout>
</template>
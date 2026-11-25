import PageLayout from "../components/page-layout.gjs";
import LargeSearch from "../components/large-search.gjs";
import { fn } from "@ember/helper";
import RouteIndex from "../components/route-index.gjs";
<template><PageLayout @showCategories={{true}} @showHeaderSearch={{false}}>
  <LargeSearch @onQueryChange={{fn (mut @controller.query)}} @onSearchReadmesChange={{fn (mut @controller.searchReadmes)}} @query={{@controller.query}} @searchReadmes={{@controller.searchReadmes}} />
  <RouteIndex class="route-index" @topAddons={{@controller.model.topAddons}} @newAddons={{@controller.model.newAddons}} @recentlyScoredAddons={{@controller.model.recentlyScoredAddons}} />
</PageLayout>
</template>
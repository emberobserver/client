import pageTitle from "ember-page-title/helpers/page-title";
import { hash, fn } from "@ember/helper";
import previousItem from "../../../helpers/previous-item.js";
import nextItem from "../../../helpers/next-item.js";
import { LinkTo } from "@ember/routing";
import AdminAddon from "../../../components/admin-addon.gjs";
<template>{{pageTitle @model.addon.name}}
<nav class="nav-previous-next">
  {{#if (hash previous=(previousItem @controller.model.list.addons @controller.model.addon) next=(nextItem @controller.model.list.addons @controller.model.addon))}}{{#let (hash previous=(previousItem @controller.model.list.addons @controller.model.addon) next=(nextItem @controller.model.list.addons @controller.model.addon)) as |nav|}}
    {{#if nav.previous}}
      <LinkTo @route="admin.review.addon" @model={{nav.previous.name}} class="previous">&laquo; Previous <span class="nav-detail">({{nav.previous.name}})</span></LinkTo>
    {{else}}
      <div class="previous"></div>
    {{/if}}
    {{#if nav.next}}
      <LinkTo @route="admin.review.addon" @model={{nav.next.name}} class="next"><span class="nav-detail">({{nav.next.name}})</span> Next &raquo;</LinkTo>
    {{else}}
      <div class="next"></div>
    {{/if}}
  {{/let}}{{/if}}
</nav>
<div class="addon-area">
  <AdminAddon @onAddonChange={{fn (mut @controller.model.addon)}} @addon={{@controller.model.addon}} @categories={{@controller.model.categories}} />
</div>
</template>
import isEqual from "../helpers/is-equal.js";
import { on } from "@ember/modifier";
import { fn } from "@ember/helper";
import SvgIcon from "./svg-icon.gjs";
<template><button type="button" class="button-option {{if (isEqual @selectedSort @key) "selected"}}" {{on "click" (fn @sortBy @key)}}>
  {{yield}}
  {{#if (isEqual @selectedSort @key)}}
    {{#if @sortAscending}}
      <SvgIcon @iconName="expand-less" />
    {{else}}
      <SvgIcon @iconName="expand-more" />
    {{/if}}
  {{/if}}
</button>
</template>
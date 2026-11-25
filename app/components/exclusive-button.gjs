import eq from "ember-truth-helpers/helpers/eq";
import { on } from "@ember/modifier";
import { fn } from "@ember/helper";
<template><button type="button" class={{if (eq @selectedValue @value) "selected"}} {{on "click" (fn @updateSelectedValue @value)}}>{{@label}}</button>
</template>
import pageTitle from "ember-page-title/helpers/page-title";
import GravatarAvatar from "../../components/gravatar-avatar.gjs";
import pluralizeThis from "../../helpers/pluralize-this.js";
import AddonList from "../../components/addon-list.gjs";
<template>{{pageTitle @model.name}}
<div class="maintainers-show">
  <header>
    <GravatarAvatar @gravatarId={{@controller.model.gravatar}} @title={{@controller.model.name}} @alt={{@controller.model.name}} />
    <h1>
      {{@controller.model.name}}
    </h1>
    <p>{{pluralizeThis @controller.model.addons.length "addon"}} maintained by {{@controller.model.name}}.</p>
  </header>
  <AddonList @addons={{@controller.model.addons}} />
</div>
</template>
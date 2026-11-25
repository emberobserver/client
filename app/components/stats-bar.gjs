import { action, get } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import RelativeTime from "./relative-time.gjs";
import commify from "../helpers/commify.js";
import HumanUrl from "./human-url.gjs";
import SvgIcon from "./svg-icon.gjs";
import { concat } from "@ember/helper";
import EmberVersionCompatibility from "./ember-version-compatibility.gjs";
import CommaSeparated from "./comma-separated.gjs";
import { LinkTo } from "@ember/routing";
import GravatarAvatar from "./gravatar-avatar.gjs";
import AddonVersionList from "./addon-version-list.gjs";
import badgePath from "../helpers/badge-path.js";
import { on } from "@ember/modifier";

export default class StatsBar extends Component {<template><div ...attributes>
<h4 class="single-column-header">Stats</h4>
<p class="addon-install test-addon-install-command">
  {{this.installCommandText}}
</p>

<ul class="stats-list">
  <li class="test-addon-latest-version">
    <b>{{@latestVersion.version}}</b> from <RelativeTime @date={{@addon.latestVersionDate}} />
  </li>
  <li class="test-addon-top-downloaded">
    {{#if @addon.isTopDownloaded}}
      <div>
        <small>TOP 10%!</small>
      </div>
    {{/if}}
    <b>{{commify @addon.lastMonthDownloads}}</b> downloads in last month
  </li>
  {{#if @addon.demoUrl}}
    <li class="test-addon-demo-url">
      <b>demo</b> <HumanUrl @url={{@addon.demoUrl}} />
    </li>
  {{/if}}
  <li class="test-addon-repo-url">
    <b>repo</b>
    {{#if @addon.hasInvalidGithubRepo}}
      <div>
        Unavailable
        <SvgIcon @iconName="help" @class="test-addon-flag-invalid-repo" @title={{concat "This addon has an incorrect repo URL in its package.json: " @addon.repositoryUrl}} />
      </div>
    {{else}}
      <HumanUrl @url={{@addon.repositoryUrl}} />
    {{/if}}
  </li>
  <li class="test-addon-package-url">
    <b>package</b> <HumanUrl @url={{@addon.npmUrl}} />
  </li>
  <li class="test-addon-license">
    <b>license</b> <a href={{this.licenseUrl}}>{{@addon.license}}</a>
  </li>
</ul>

{{#if @testResult}}
  {{#unless @isTestResultForLatestVersion}}
    <em class="test-ember-version-compatibility-new-version-warning">
      <SvgIcon @iconName="new-releases" /> New
      versions of this addon have been released since these tests ran.
    </em>
  {{/unless}}
  <EmberVersionCompatibility @testResult={{@testResult}} />
{{/if}}

<h6>npm keywords</h6>

<p class="keywords test-addon-keywords">

  {{#each @addon.keywords as |keyword|}}
    <CommaSeparated @list={{@addon.keywords}} @item={{keyword}} as |value separator|>
      {{value.keyword}}{{separator}}
    </CommaSeparated>
  {{/each}}
</p>

<h6>maintainers</h6>
<p class="test-addon-maintainers">
  {{#each @addon.maintainers as |maintainer|}}
    <LinkTo @route="maintainers.show" @model={{maintainer.name}}>
      <GravatarAvatar @gravatarId={{maintainer.gravatar}} @title={{maintainer.name}} @alt={{maintainer.name}} />
    </LinkTo>
  {{/each}}
</p>

{{#if @latestVersion.emberCliVersion}}
  <h6>ember-cli version</h6>
  <p class="test-addon-ember-cli-version">{{@latestVersion.emberCliVersion}}</p>
{{/if}}

<h6 class="test-addon-version-count">versions ({{@sortedAddonVersions.length}})</h6>

<p>
  <AddonVersionList @versions={{@sortedAddonVersions}} />
</p>

<section class="badge test-addon-badge">
  <img alt="Addon Badge" src={{badgePath @addon.name}}>
  <button type="button" class="copy-to-clipboard test-show-badge-markdown" title="Show badge markdown to copy" {{on "click" this.toggleBadgeText}}><SvgIcon @iconName="content-paste" /></button>
  {{#if this.showBadgeText}}
    <hr>
    <code class="test-badge-markdown">
      [![Ember Observer Score](https://emberobserver.com{{badgePath @addon.name}})](https://emberobserver.com/addons/{{@addon.name}})
    </code>
  {{/if}}
</section>
<hr>
<LinkTo @route="addons.correct" @model={{@addon.name}} class="test-addon-correction-link">
  Suggest a correction
</LinkTo>
</div>
</template>
  @tracked
  showBadgeText = false;

  get licenseUrl() {
    return `https://spdx.org/licenses/${get(this.args, 'addon.license')}`;
  }

  get installCommandText() {
    return `ember install ${get(this.args, 'addon.name')}`;
  }

  @action
  toggleBadgeText() {
    this.showBadgeText = !this.showBadgeText;
  }
}

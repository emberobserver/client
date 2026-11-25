import { asRecord } from 'ember-observer/utils/as-array';
import { action, set, get } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';
import { questions } from '../models/review';
import { tracked } from '@glimmer/tracking';
import { LinkTo } from "@ember/routing";
import OfficialIcon from "./official-icon.gjs";
import DependencyIcon from "./dependency-icon.gjs";
import RelativeTime from "./relative-time.gjs";
import CommaSeparated from "./comma-separated.gjs";
import ScoreDisplay from "./score-display.gjs";
import SvgIcon from "./svg-icon.gjs";
import ToggleSwitch from "./toggle-switch.gjs";
import { fn } from "@ember/helper";
import { Input, Textarea } from "@ember/component";
import CategoryChooser from "./category-chooser.gjs";
import { on } from "@ember/modifier";
import perform from "ember-concurrency/helpers/perform";
import momentFormat from "ember-moment/helpers/moment-format";
import AddonReview from "./addon-review.gjs";
import AdminAddonReviewForm from "./admin-addon-review-form.gjs";
import MarkdownToSanitizedHtml from "./markdown-to-sanitized-html.gjs";

export default class AdminAddon extends Component {<template><h2>
  <LinkTo @route="addons.show" @model={{this.addon.name}} class="test-addon-link">
    {{this.addon.name}}
    {{#if this.addon.isOfficial}}
      <OfficialIcon @class="test-official-icon" />
    {{/if}}
    {{#if this.addon.isCliDependency}}
      <DependencyIcon @class="test-cli-dep-icon" />
    {{/if}}
  </LinkTo>
</h2>

<section class="addon-info">
  <div class="test-last-updated">
    <b>{{this.addon.latestAddonVersion.version}}</b> from <RelativeTime @date={{this.addon.latestVersionDate}} />
  </div>
  <div class="test-description"><b>description</b> {{this.addon.description}}</div>
  {{#if this.addon.demoUrl}}
    <div class="test-addon-demo-url">
      <b>demo</b> <a href={{this.addon.demoUrl}}>{{this.addon.demoUrl}}</a>
    </div>
  {{/if}}
  <div class="test-addon-package-url">
    <b>package</b> <a href={{this.addon.npmUrl}}>{{this.addon.npmUrl}}</a>
  </div>
  <div class="test-addon-license">
    <b>license</b> {{this.addon.license}}
  </div>
  <div>
    <b>npm keywords</b>
    {{#each this.addon.keywords as |keyword|}}
      <CommaSeparated @list={{this.addon.keywords}} @item={{keyword}} as |value separator|>
        {{value.keyword}}{{separator}}
      </CommaSeparated>
    {{/each}}
  </div>
  {{#if this.addon.ranking}}
    <span><LinkTo @route="addons.top">Ranks #{{this.addon.ranking}} of the top 100 addons!</LinkTo></span>
  {{/if}}
</section>

<section>
  <ScoreDisplay @addon={{this.addon}} as |val|>
    Score <b class="test-score">{{val}}</b>
  </ScoreDisplay>
</section>

<section>
  <label>Repo URL</label>
  {{#if this.addon.repositoryUrl}}
    <a href={{this.addon.repositoryUrl}} target="repo" class="test-repo-url">{{this.addon.repositoryUrl}}</a>
  {{else}}
    <em>Missing</em>
  {{/if}}
  <a href="https://www.google.com/search?q=%22{{this.addon.name}}%22" target="_blank" rel="noopener noreferrer" title="Search Google">&nbsp;<SvgIcon @iconName="google" /></a>
  |
  <a href="https://github.com/search?q=%22{{this.addon.name}}%22" target="_blank" rel="noopener noreferrer" title="Search GitHub"><SvgIcon @iconName="github" /></a>
  <ToggleSwitch @label={{if this.addon.hasInvalidGithubRepo "Has invalid Repo URL" "Has valid Repo URL"}} @isChecked={{not this.addon.hasInvalidGithubRepo}} @onToggle={{this.updateInvalidRepoFlag}} @name="repo" class="test-toggle-repo-validity" />
</section>

<section class="toggles">
  <ToggleSwitch @label={{if this.addon.isWip "Is a WIP" "Not a WIP"}} @isChecked={{not this.addon.isWip}} @onToggle={{this.updateIsWipFlag}} @name="wip" class="test-toggle-is-wip" />
  <ToggleSwitch @label={{if this.addon.isDeprecated "Deprecated" "Active"}} @isChecked={{not this.addon.isDeprecated}} @onToggle={{this.updateIsDeprecatedFlag}} @name="deprecated" class="test-toggle-is-deprecated" />
  <ToggleSwitch @label={{if this.addon.isHidden "Hidden" "Visible"}} @isChecked={{not this.addon.isHidden}} @onToggle={{this.updateIsHiddenFlag}} @name="hidden" class="hidden-toggle test-toggle-is-hidden" />
  <ToggleSwitch @label="Is Official?" @isChecked={{this.addon.isOfficial}} @onToggle={{fn (mut this.addon.isOfficial)}} @name="official" class="test-toggle-is-official" />
  <ToggleSwitch @label="Is CLI Dependency?" @isChecked={{this.addon.isCliDependency}} @onToggle={{fn (mut this.addon.isCliDependency)}} @name="cli-dep" class="test-toggle-is-cli-dep" />
  <ToggleSwitch @label="Extends Ember?" @isChecked={{this.addon.extendsEmber}} @onToggle={{fn (mut this.addon.extendsEmber)}} @name="extends-ember" class="test-toggle-extends-ember" />
  <ToggleSwitch @label="Extends Ember CLI?" @isChecked={{this.addon.extendsEmberCli}} @onToggle={{fn (mut this.addon.extendsEmberCli)}} @name="extends-ember-cli" class="test-toggle-extends-ember-cli" />
  <ToggleSwitch @label="Is Monorepo?" @isChecked={{this.addon.isMonorepo}} @onToggle={{fn (mut this.addon.isMonorepo)}} @name="is-monorepo" class="test-toggle-is-monorepo" />
</section>

<section class="with-default-styling">
  <label>Override Repo URL</label>
  <Input @value={{this.addon.overrideRepositoryUrl}} class="test-override-repo-url-input" autocomplete="off" />
</section>

<section class="with-default-styling">
  <label>Note</label>
  <Textarea @value={{this.addon.note}} rows="3" class="note-input test-note-input" autocomplete="off" /></section>

<section>
  <CategoryChooser @categories={{@categories}} @addon={{this.addon}} @onchange={{fn (mut this.addon.categories)}} />
</section>

<section>
  {{#if this.saveAddon.isRunning}}
    <button type="button" class="button" disabled>Saving...</button>
  {{else}}
    <button type="button" class="button test-save-addon" {{on "click" (perform this.saveAddon)}}>Save</button>
  {{/if}}
  <div class="note">Last saved <RelativeTime @date={{this.addon.updatedAt}} /> ({{momentFormat this.addon.updatedAt "MMMM DD, YYYY h:mm:ss" allowEmpty=true}})</div>
</section>

<section class="latest-review">
  <h5 class="header">Latest Review</h5>
  <div class="contents">
    {{#if this.addon.latestReview}}
      {{#if (neq this.addon.latestReview.version.version this.addon.latestAddonVersion.version)}}
        <em class="test-review-new-version-warning"><SvgIcon @iconName="new-releases" /> New versions of this addon have been released since this review was undertaken.</em>
      {{/if}}
      <AddonReview @review={{this.addon.latestReview}} />
      {{#if this.renewLatestReview.isIdle}}
        <button type="button" {{on "click" (perform this.renewLatestReview)}} class="button test-renew-latest-review">Renew Review</button>
      {{else}}
        <button type="button" disabled class="button">Saving...</button>
      {{/if}}
      {{#if this.recentlyRenewed}}
        <b>Saved!</b>
      {{/if}}
    {{else}}
      <p class="no-review test-no-review">This addon has not yet been reviewed.</p>
    {{/if}}
    <hr>
    <section class="with-default-styling">
      <AdminAddonReviewForm @addon={{this.addon}} />
    </section>
  </div>
</section>

<section>
  {{#if this.addon.readme}}
    {{#unless this.addon.hasInvalidGithubRepo}}
      <section class="readme">
        <p class="header">README.md</p>
        <p class="test-addon-readme contents">
          <MarkdownToSanitizedHtml @markdown={{this.addon.readme.contents}} @tables={{true}} @ghCodeBlocks={{true}} @tasklists={{true}} @simplifiedAutoLink={{true}} />
        </p>
      </section>
    {{/unless}}
  {{/if}}
</section>
</template>
  @service
  store;

  @tracked localAddon;

  get addon() {
    let own = this.localAddon;

    return own && own.arg === this.args.addon ? own.value : this.args.addon;
  }

  set addon(value) {
    if (value === this.addon) return;

    this.localAddon = { arg: this.args.addon, value };
    this.args.onAddonChange?.(value);
  }

  @tracked
  recentlyRenewed = false;

  @action
  updateInvalidRepoFlag(value) {
    set(this, 'addon.hasInvalidGithubRepo', !value);
  }

  @action
  updateIsWipFlag(value) {
    set(this, 'addon.isWip', !value);
  }

  @action
  updateIsDeprecatedFlag(value) {
    set(this, 'addon.isDeprecated', !value);
  }

  @action
  updateIsHiddenFlag(value) {
    set(this, 'addon.isHidden', !value);
  }

  saveAddon = task({ drop: true }, async () => {
    try {
      await this.addon.save();
    } catch (e) {
      window.alert('Failed to save addon');
    }
  });

  renewLatestReview = task({ drop: true }, async () => {
    let newReview = this.store.createRecord('review');
    let latestReview = get(this, 'addon.latestReview');

    questions.forEach(function (question) {
      newReview.set(question.fieldName, latestReview.get(question.fieldName));
    });
    set(newReview, 'review', asRecord(get(latestReview, 'review')));
    set(newReview, 'version', asRecord(get(this, 'addon.latestAddonVersion')));

    try {
      await newReview.save();
      set(this.addon, 'latestReview', newReview);
      await this.addon.save();
      this.completeRenew.perform();
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      window.alert('Failed to renew review');
    }
  });

  completeRenew = task({ drop: true }, async () => {
    this.recentlyRenewed = true;
    await timeout(2000);
    this.recentlyRenewed = false;
  });
}

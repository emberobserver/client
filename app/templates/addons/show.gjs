import pageTitle from "ember-page-title/helpers/page-title";
import OfficialIcon from "../../components/official-icon.gjs";
import DependencyIcon from "../../components/dependency-icon.gjs";
import AddonNote from "../../components/addon-note.gjs";
import { LinkTo } from "@ember/routing";
import ScoreDetail from "../../components/score-detail.gjs";
import InlineCategoryList from "../../components/inline-category-list.gjs";
import pluralize from "../../helpers/pluralize.js";
import RelativeTime from "../../components/relative-time.gjs";
import SvgIcon from "../../components/svg-icon.gjs";
import AddonReview from "../../components/addon-review.gjs";
import AddonSize from "../../components/addon-size.gjs";
import DependencyTables from "../../components/dependency-tables.gjs";
import MarkdownToSanitizedHtml from "../../components/markdown-to-sanitized-html.gjs";
import StatsBar from "../../components/stats-bar.gjs";
<template>{{pageTitle @model.addon.name}}
<div class="addons-show with-default-styling">
  <div class="addon-info">
    <section class="test-addon-header">
      {{#if @controller.addon.isDeprecated}}
        <label class="alert test-addon-flag-deprecation">DEPRECATED</label>
      {{/if}}

      {{#if @controller.addon.isNewAddon}}
        <small class="test-addon-flag-new">NEW!</small>
      {{/if}}

      <h1>
        {{#if @controller.addon.isOfficial}}
          <OfficialIcon @class="test-addon-flag-official" />
        {{/if}}

        {{#if @controller.addon.isCliDependency}}
          <DependencyIcon @class="test-addon-flag-cli-dependency" />
        {{/if}}

        {{@controller.addon.name}}
      </h1>

      <p>{{@controller.addon.description}}</p>
    </section>
    {{#if @controller.addon.note}}
      <AddonNote @content={{@controller.addon.note}} />
    {{/if}}

    {{#if @controller.addon.ranking}}
      <span><LinkTo @route="addons.top">Ranks #{{@controller.addon.ranking}} of the top 100 addons!</LinkTo></span>
    {{/if}}
    <ScoreDetail @addon={{@controller.addon}} />
    <section class="categories">
      <h4>Categories</h4>
      <p>
        <InlineCategoryList @categories={{@controller.addon.categories}} />
        {{#unless @controller.addon.categories}}
          This addon hasn't been categorized yet.
        {{/unless}}
      </p>
    </section>
    {{#if @controller.hasGithubData}}
      <section class="repo-info test-github-data">
        <h4>GitHub</h4>

        {{#if @controller.addon.isTopStarred}}
          <small>TOP 10% STARRED</small>
        {{/if}}
        <div class="stats">
          <ul>
            <li class="test-open-issues">{{@controller.addon.githubStats.openIssues}}<span>{{pluralize @controller.addon.githubStats.openIssues "Open Issue"}}</span></li>
            <li class="test-forks">{{@controller.addon.githubStats.forks}}<span>{{pluralize @controller.addon.githubStats.forks "Fork"}}</span></li>
            <li class="test-stars">{{@controller.addon.githubStats.stars}}<span>Starred</span></li>
            <li class="test-contributors">{{@controller.addon.githubUsers.length}}<span>{{pluralize @controller.addon.githubUsers.length "Contributor"}}</span></li>
          </ul>
        </div>
        <div class="commit-stats">
          <strong>latest commit</strong>
          <p class="test-latest-commit"><RelativeTime @date={{@controller.addon.githubStats.latestCommitDate}} /></p>

          <strong>first commit</strong>
          <p class="test-first-commit"><RelativeTime @date={{@controller.addon.githubStats.firstCommitDate}} /></p>
        </div>
      </section>
    {{/if}}

    <section class="latest-review">
      <h4>Review</h4>
      {{#if @controller.latestReview}}
        {{#unless @controller.isLatestReviewForLatestVersion}}
          <em class="test-review-new-version-warning"><SvgIcon @iconName="new-releases" /> New versions of this addon have been released since this review was undertaken.</em>
        {{/unless}}
        <AddonReview @review={{@controller.latestReview}} />
      {{else}}
        <p class="no-review test-no-review">This addon has not yet been reviewed.</p>
      {{/if}}
    </section>

    {{#if @controller.latestVersion.addonSize}}
      <section class="latest-size test-latest-size">
        <h4>Size</h4>
        <AddonSize @addonSize={{@controller.latestVersion.addonSize}} @showTotalRow={{true}} />
      </section>
    {{/if}}

    <section class="addon-dependencies">
      <DependencyTables @addonVersion={{@controller.latestVersion}} @addon={{@controller.addon}} />
    </section>

    {{#if @controller.addon.readme}}
      {{#unless @controller.addon.hasInvalidGithubRepo}}
        <section class="readme">
          <p class="header">README.md</p>
          <p class="test-addon-readme contents">
            <MarkdownToSanitizedHtml @markdown={{@controller.addon.readme.contents}} @tables={{true}} @ghCodeBlocks={{true}} @tasklists={{true}} @simplifiedAutoLink={{true}} />
          </p>
        </section>
      {{/unless}}
    {{/if}}
  </div>

  <div class="addon-stats">
    {{#if @controller.session.isAuthenticated}}
      <LinkTo @route="admin.review.addon" @model={{@controller.addon.name}}>
        <button type="button" class="button">Edit</button>
      </LinkTo>
    {{/if}}

    <StatsBar @addon={{@controller.addon}} @latestVersion={{@controller.latestVersion}} @testResult={{@controller.model.latestTestResult}} @isTestResultForLatestVersion={{@controller.isTestResultForLatestVersion}} @sortedAddonVersions={{@controller.sortedAddonVersions}} />
  </div>
</div>
</template>
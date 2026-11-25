import ScoreDisplay from "./score-display.gjs";
import { LinkTo } from "@ember/routing";
import OfficialIcon from "./official-icon.gjs";
import DependencyIcon from "./dependency-icon.gjs";
import InlineCategoryList from "./inline-category-list.gjs";
import RelativeTime from "./relative-time.gjs";
<template><div>
  {{#if @showRanking}}
    <span class="ranking">#{{@addon.ranking}}</span>
  {{else}}
    <ScoreDisplay @addon={{@addon}} as |score|>
      {{score}}
    </ScoreDisplay>
  {{/if}}
  <div class="desc">
    <LinkTo @route="addons.show" @model={{@addon.name}} class="addon-link test-addon-name">
      <span class="addon-name">
        {{@addon.name}}
        {{#if @addon.isDeprecated}}
          <span class="notice">
            (Deprecated)
          </span>
        {{/if}}
      </span>
      {{#if @addon.isOfficial}}
        <OfficialIcon />
      {{/if}}
      {{#if @addon.isCliDependency}}
        <DependencyIcon />
      {{/if}}
      <small>- {{@addon.description}}</small>
    </LinkTo>
    <p>
      <small><InlineCategoryList @categories={{@addon.categories}} /></small>
      <span class="last-updated">Last updated <RelativeTime @date={{@addon.latestVersionDate}} /></span>
    </p>
  </div>
</div>
</template>
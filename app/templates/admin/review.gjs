import pageTitle from "ember-page-title/helpers/page-title";
import PowerSelect from "ember-power-select/components/power-select";
import DotSpinner from "../../components/dot-spinner.gjs";
import { LinkTo } from "@ember/routing";
import ScoreDisplay from "../../components/score-display.gjs";
<template>{{pageTitle "Review"}}
<div class="route-admin-review {{if @controller.list "with-index"}}">
  <div class="review-index test-review-index">
    <header class="list-header">
      <h1 class="test-list-select">
        <PowerSelect @options={{@controller.possibleLists}} @selected={{@controller.selectedList}} @searchField="title" @dropdownClass="test-list-select-dropdown" @onChange={{@controller.selectList}} as |option|>
          {{option.title}}
        </PowerSelect>
      </h1>
      {{#if @controller.adminLists.find.isRunning}}
        <DotSpinner />
      {{else}}
        <div class="addon-count note test-addon-count">{{@controller.addons.length}} matching addons</div>
      {{/if}}
    </header>
    {{#if @controller.adminLists.find.isIdle}}
      <ul class="review-addon-list">
        {{#each @controller.addons as |addon|}}
          <LinkTo @route="admin.review.addon" @model={{addon.name}}>
            <li class="test-review-list-item">
              <ScoreDisplay @addon={{addon}} as |score|>
                {{score}}
              </ScoreDisplay>
              <span class="review-addon-list-name">
                {{addon.name}}
                {{#if addon.isDeprecated}}
                  <span class="notice">(Deprecated)</span>
                {{/if}}
              </span>
            </li>
          </LinkTo>
        {{/each}}
      </ul>
    {{/if}}
  </div>
  <div class="addon-container">
    {{outlet}}
  </div>
</div>
</template>
import asArray from 'ember-observer/utils/as-array';
import { action, get } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import ScoreDisplay from "./score-display.gjs";
import { on } from "@ember/modifier";
import checkPassProportion from "../helpers/check-pass-proportion.js";
import scoreComponentColor from "../helpers/score-component-color.js";
import formatScoreContribution from "../helpers/format-score-contribution.js";

export default class ScoreDetail extends Component {<template><div ...attributes>
<section class="score-detail">
  <h4>
    <ScoreDisplay @addon={{this.addon}} as |score|>
      Score <b>{{score}}</b>
    </ScoreDisplay>
  </h4>
  {{#if this.showExplanation}}
    <button type="button" class="btn-link info-action" {{on "click" this.toggleExplainScore}}>
      Hide This
    </button>

    {{#unless this.addon.hasBeenReviewed}}
      <p class="test-not-reviewed-warning"><em>N/A - This addon has not yet been reviewed.</em></p>
    {{/unless}}
    {{#if this.fetchScoreCalculation.lastSuccessful.value}}
      <ul>
        {{#each this.fetchScoreCalculation.lastSuccessful.value.info.checks as |check|}}
          <li class="score-component test-score-component">
            <div class="score-component-description">
              {{check.explanation}}
            </div>
            <div class="score-component-numbers">
              {{#let (checkPassProportion check) as |proportion|}}
                Value:
                <span class="score-component-value test-value {{scoreComponentColor proportion}}">{{proportion}}</span>  Max Contribution: <span class="test-max-contribution">{{formatScoreContribution check.maxContribution}}</span>
              {{/let}}
            </div>
          </li>
        {{/each}}
      </ul>
    {{/if}}
  {{else}}
    <button type="button" class="btn-link info-action test-show-score-explanation" {{on "click" this.toggleExplainScore}}>
      Explain This
    </button>
  {{/if}}
</section>
</div>
</template>
  constructor(owner, args) {
    super(owner, args);
    this.fetchScoreCalculation.perform();
  }

  @tracked
  showExplanation = false;

  get addon() {
    return this.args.addon;
  }

  @service
  store;

  fetchScoreCalculation = task(async () => {
    let calculationResult = await this.store.query('score-calculation', {
      filter: { addonId: get(this.addon, 'id'), latest: true },
    });
    return asArray(calculationResult)[0];
  });

  @action
  toggleExplainScore() {
    this.showExplanation = !this.showExplanation;
  }
}

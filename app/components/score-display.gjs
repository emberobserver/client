import { get } from '@ember/object';
import Component from '@glimmer/component';
import toFixed from "../helpers/to-fixed.js";
import isEqual from "../helpers/is-equal.js";

export default class ScoreDisplay extends Component {<template>{{#if @addon.isDeprecated}}
  <span class="score deprecated">
    {{yield "x"}}
  </span>
{{else if @addon.isWip}}
  <span class="score wip">
    {{yield "WIP"}}
  </span>
{{else}}
  {{#if this.hasBeenReviewedAndScored}}
    <span class="score" data-score={{toFixed @addon.score 0}}>
      {{#if (isEqual @addon.score 10)}}
        {{yield (toFixed @addon.score 0)}}
      {{else}}
        {{yield (toFixed @addon.score 1)}}
      {{/if}}
    </span>
  {{else}}
    <span class="score">
      {{yield "?"}}
    </span>
  {{/if}}
{{/if}}
</template>
  get hasBeenReviewedAndScored() {
    let score = get(this.args, 'addon.score');
    return typeof score === 'number' && get(this.args, 'addon.hasBeenReviewed');
  }
}

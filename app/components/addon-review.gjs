import { isEmpty } from '@ember/utils';
import Component from '@glimmer/component';
import { questions } from '../models/review';
import momentFormat from "ember-moment/helpers/moment-format";
import MarkdownToHtml from "ember-cli-showdown/components/markdown-to-html";

const ANSWER_MAP = {
  1: 'Yes',
  2: 'No',
  3: 'N/A',
  4: 'Unknown',
};

export default class AddonReview extends Component {<template><div ...attributes>
{{#if @review}}
  <p class="review-date">
    Manually reviewed on {{momentFormat @review.createdAt "MMMM Do YYYY" allowEmpty=true}} for version {{@review.version.version}}
  </p>
  <ol class="questions">
    {{#each this.answeredQuestions as |question|}}
      <li class="test-review-question">
        <span class="question">{{question.text}}</span>
        <span class="answer">{{question.answer}}</span>
      </li>
    {{/each}}
  </ol>
  {{#if @review.review}}
    <br>
    <h6>Comments</h6>
    <fieldset class="test-review-notes">
      <MarkdownToHtml @markdown={{@review.review}} />
    </fieldset>
  {{/if}}
{{/if}}
</div>
</template>
  get answeredQuestions() {
    let review = this.args.review;
    return questions
      .filter(function (question) {
        return !isEmpty(review.get(question.fieldName));
      })
      .map(function (question) {
        return {
          text: question.text,
          answer: ANSWER_MAP[review.get(question.fieldName)],
        };
      });
  }
}

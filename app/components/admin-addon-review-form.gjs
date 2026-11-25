import { asRecord } from 'ember-observer/utils/as-array';
/* eslint-disable ember/no-component-lifecycle-hooks */
/* eslint-disable ember/no-component-lifecycle-hooks */
import { service as inject } from '@ember/service';
import Component from '@glimmer/component';
import { action, set, get } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { questions } from '../models/review';
import { tracked } from '@glimmer/tracking';
import { on } from "@ember/modifier";
import preventDefault from "../helpers/prevent-default.js";
import perform from "ember-concurrency/helpers/perform";
import ExclusiveButtonGroup from "./exclusive-button-group.gjs";
import { get as get0, fn } from "@ember/helper";
import { Textarea } from "@ember/component";
import MarkdownToHtml from "ember-cli-showdown/components/markdown-to-html";

export default class AdminAddonReviewForm extends Component {<template><div ...attributes>
{{this.didReceiveAttrs @addon}}
<h5>Review this addon</h5>
<form class="review-form" {{on "submit" (preventDefault (perform this.saveReview))}}>
  <ol>
    {{#each this.questions as |question|}}
      <li class="test-review-question">
        <div class="question">{{question.text}}</div>
        <ExclusiveButtonGroup @selectedValue={{get0 this.reviewProperties question.fieldName}} @updateSelectedValue={{fn this.selectOption question.fieldName}} as |btn|>
          <btn @value={{1}} @label="Yes" />
          <btn @value={{2}} @label="No" />
          <btn @value={{3}} @label="N/A" />
          <btn @value={{4}} @label="Unknown" />
        </ExclusiveButtonGroup>
      </li>
    {{/each}}
  </ol>
  <Textarea @value={{this.reviewText}} class="test-addon-review-notes" />  {{#if this.reviewText}}    <fieldset>
      <MarkdownToHtml @markdown={{this.reviewText}} />
    </fieldset>
  {{/if}}
  {{#if this.saveReview.isIdle}}
    <input type="submit" class="button test-addon-review-save" value="Create Review">
  {{else}}
    <input type="submit" class="button" value="Saving..." disabled>
  {{/if}}
  {{#if this.recentlySaved}}
    <b>Saved!</b>
  {{/if}}
</form>
</div>
</template>
  @tracked reviewText;

  @tracked recentlySaved;

  get addon() {
    return this.args.addon;
  }

  @tracked
  reviewProperties = null;

  questions = questions;

  @inject()
  store;

  @action
  didReceiveAttrs() {
    this.reset();
  }

  reset() {
    this.reviewProperties = {};
  }

  @action
  selectOption(fieldName, value) {
    set(this, `reviewProperties.${fieldName}`, value);
  }

  saveReview = task({ drop: true }, async () => {
    let newReview = this.store.createRecord('review', this.reviewProperties);
    set(newReview, 'review', asRecord(this.reviewText));
    set(newReview, 'version', asRecord(get(this, 'addon.latestAddonVersion')));
    try {
      await newReview.save();
      set(this.addon, 'latestReview', newReview);
      await this.addon.save();
      this.reset();
      this.complete.perform();
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      window.alert('Failed to create review');
    }
  });

  complete = task({ drop: true }, async () => {
    this.recentlySaved = true;
    await timeout(2000);
    this.recentlySaved = false;
  });
}

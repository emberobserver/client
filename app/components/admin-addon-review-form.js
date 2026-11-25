import { asRecord } from 'ember-observer/utils/as-array';
/* eslint-disable ember/no-component-lifecycle-hooks */
import { inject } from '@ember/service';
import Component from '@glimmer/component';
import { action, set, get } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { questions } from '../models/review';
import { tracked } from '@glimmer/tracking';

export default class AdminAddonReviewForm extends Component {
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

  @(task(function* () {
    let newReview = this.store.createRecord('review', this.reviewProperties);
    set(newReview, 'review', asRecord(this.reviewText));
    set(newReview, 'version', asRecord(get(this, 'addon.latestAddonVersion')));
    try {
      yield newReview.save();
      set(this.addon, 'latestReview', newReview);
      yield this.addon.save();
      this.reset();
      this.complete.perform();
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      window.alert('Failed to create review');
    }
  }).drop())
  saveReview;

  @(task(function* () {
    this.recentlySaved = true;
    yield timeout(2000);
    this.recentlySaved = false;
  }).drop())
  complete;
}

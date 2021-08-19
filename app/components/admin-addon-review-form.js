import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from 'tracked-built-ins';
import { dropTask, timeout } from 'ember-concurrency';
import { questions } from 'ember-observer/models/review';

export default class AdminAddonReviewForm extends Component {
  @tracked reviewProperties = tracked({});

  @tracked
  recentlySaved = false;

  questions = questions;

  @service
  store;

  @action
  reset() {
    this.reviewProperties = tracked({});
  }

  @action
  selectOption(fieldName, value) {
    this.reviewProperties[fieldName] = value;
  }

  @dropTask
  *saveReview() {
    let newReview = this.store.createRecord('review', this.reviewProperties);
    newReview.set('review', this.reviewText);
    newReview.set('version', this.args.addon.get('latestAddonVersion'));
    try {
      yield newReview.save();
      this.args.addon.set('latestReview', newReview);
      yield this.args.addon.save();
      this.reset();
      this.complete.perform();
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      window.alert('Failed to create review');
    }
  }

  @dropTask
  *complete() {
    this.recentlySaved = true;
    yield timeout(2000);
    this.recentlySaved = false;
  }
}

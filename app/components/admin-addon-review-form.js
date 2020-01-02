import classic from 'ember-classic-decorator';
import { inject } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { questions } from '../models/review';

@classic
export default class AdminAddonReviewForm extends Component {
  addon = null;
  reviewProperties = null;
  questions = questions;

  @inject()
  store;

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);
    this.reset();
  }

  reset() {
    this.set('reviewProperties', {});
  }

  selectOption(fieldName, value) {
    this.set(`reviewProperties.${fieldName}`, value);
  }

  @(task(function* () {
    let newReview = this.store.createRecord('review', this.reviewProperties);
    newReview.set('review', this.reviewText);
    newReview.set('version', this.get('addon.latestAddonVersion'));
    try {
      yield newReview.save();
      this.addon.set('latestReview', newReview);
      yield this.addon.save();
      this.reset();
      this.complete.perform();
    } catch(e) {
      console.error(e); // eslint-disable-line no-console
      window.alert('Failed to create review');
    }
  }).drop())
  saveReview;

  @(task(function* () {
    this.set('recentlySaved', true);
    yield timeout(2000);
    this.set('recentlySaved', false);
  }).drop())
  complete;
}

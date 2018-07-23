import Component from '@ember/component';
import { inject } from '@ember/service';
import { task } from 'ember-concurrency';
import { questions } from '../models/review';

export default Component.extend({
  addon: null,
  reviewProperties: null,
  questions,
  store: inject(),
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('reviewProperties', {});
  },
  selectOption(fieldName, value) {
    this.set(`reviewProperties.${fieldName}`, value);
  },
  saveReview: task(function* () {
    let newReview = this.get('store').createRecord('review', this.get('reviewProperties'));
    newReview.set('review', this.get('reviewText'));
    newReview.set('version', this.get('addon.latestAddonVersion'));
    try {
      yield newReview.save();
    } catch(e) {
      console.error(e); // eslint-disable-line no-console
      window.alert('Failed to create review');
    }
  }).drop(),
});

import Component from '@ember/component';
import { inject } from '@ember/service';
import { task } from 'ember-concurrency';
import { questions } from '../models/review';

export default Component.extend({
  addon: null,
  reviewProperties: null,
  questions,
  questionOptions: [
    { label: 'Yes', value: 1 },
    { label: 'No', value: 2 },
    { label: 'N/A', value: 3 },
    { label: 'Unknown', value: 4 }
  ],
  store: inject(),
  init() {
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

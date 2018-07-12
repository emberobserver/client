import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  tagName: '',
  store: service(),
  addon: null,
  sortedReviews: computed('addon.reviews.[]', function() {
    return (this.get('addon.reviews') || []).sortBy('versionReleased').reverse();
  }),
  latestReview: alias('sortedReviews.firstObject'),
  isLatestReviewForLatestVersion: computed('latestReview.version.id', 'addon.latestAddonVersion.id', function() {
    return this.get('latestReview.version.id') === this.get('addon.latestAddonVersion.id');
  }),
  updateInvalidRepoFlag(value) {
    this.set('addon.hasInvalidGithubRepo', !value);
  },
  updateIsWipFlag(value) {
    this.set('addon.isWip', !value);
  },
  updateIsDeprecatedFlag(value) {
    this.set('addon.isDeprecated', !value);
  },
  updateIsHiddenFlag(value) {
    this.set('addon.isHidden', !value);
  },
  saveAddon: task(function* () {
    try {
      yield this.get('addon').save();
    } catch(e) {
      window.alert('Failed to save addon');
    }
  }).drop(),
  renewLatestReview: task(function* () {
    let newReview = this.get('store').createRecord('review');
    let latestReview = this.get('latestReview');

    latestReview.questions.forEach(function(question) {
      newReview.set(question.fieldName, latestReview.get(question.fieldName));
    });
    newReview.set('review', latestReview.get('review'));
    newReview.set('version', this.get('addon.latestAddonVersion'));

    try {
      yield newReview.save();
    } catch(e) {
      console.error(e); // eslint-disable-line no-console
      window.alert('Failed to renew review');
    }
  }).drop(),
});

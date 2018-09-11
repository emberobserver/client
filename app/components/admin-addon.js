import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { questions } from '../models/review';

export default Component.extend({
  tagName: '',
  store: service(),
  addon: null,
  recentlyRenewed: false,
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
    let latestReview = this.get('addon.latestReview');

    questions.forEach(function(question) {
      newReview.set(question.fieldName, latestReview.get(question.fieldName));
    });
    newReview.set('review', latestReview.get('review'));
    newReview.set('version', this.get('addon.latestAddonVersion'));

    try {
      yield newReview.save();
      this.addon.set('latestReview', newReview);
      yield this.addon.save();
      this.completeRenew.perform();
    } catch(e) {
      console.error(e); // eslint-disable-line no-console
      window.alert('Failed to renew review');
    }
  }).drop(),
  completeRenew: task(function* () {
    this.set('recentlyRenewed', true);
    yield timeout(2000);
    this.set('recentlyRenewed', false);
  }).drop(),
});

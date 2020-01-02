import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { questions } from '../models/review';

@classic
@tagName('')
export default class AdminAddon extends Component {
  @service
  store;

  addon = null;
  recentlyRenewed = false;

  updateInvalidRepoFlag(value) {
    this.set('addon.hasInvalidGithubRepo', !value);
  }

  updateIsWipFlag(value) {
    this.set('addon.isWip', !value);
  }

  updateIsDeprecatedFlag(value) {
    this.set('addon.isDeprecated', !value);
  }

  updateIsHiddenFlag(value) {
    this.set('addon.isHidden', !value);
  }

  @(task(function* () {
    try {
      yield this.addon.save();
    } catch(e) {
      window.alert('Failed to save addon');
    }
  }).drop())
  saveAddon;

  @(task(function* () {
    let newReview = this.store.createRecord('review');
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
  }).drop())
  renewLatestReview;

  @(task(function* () {
    this.set('recentlyRenewed', true);
    yield timeout(2000);
    this.set('recentlyRenewed', false);
  }).drop())
  completeRenew;
}

import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { dropTask, timeout } from 'ember-concurrency';
import { questions } from '../models/review';
import { tracked } from '@glimmer/tracking';

export default class AdminAddon extends Component {
  @service
  store;

  @tracked recentlyRenewed = false;

  @action
  updateInvalidRepoFlag(value) {
    this.args.addon.set('hasInvalidGithubRepo', !value);
  }

  @action
  updateIsWipFlag(value) {
    this.args.addon.set('isWip', !value);
  }

  @action
  updateIsDeprecatedFlag(value) {
    this.args.addon('isDeprecated', !value);
  }

  @action
  updateIsHiddenFlag(value) {
    this.args.addon('isHidden', !value);
  }

  @dropTask
  *saveAddon() {
    try {
      yield this.args.addon.save();
    } catch (e) {
      window.alert('Failed to save addon');
    }
  }

  @dropTask
  *renewLatestReview() {
    let newReview = this.store.createRecord('review');
    let latestReview = this.args.addon.latestReview;

    questions.forEach(function (question) {
      newReview.set(question.fieldName, latestReview.get(question.fieldName));
    });
    newReview.set('review', latestReview.get('review'));
    newReview.set('version', this.args.addon.get('latestAddonVersion'));

    try {
      yield newReview.save();
      this.args.addon.set('latestReview', newReview);
      yield this.args.addon.save();
      this.completeRenew.perform();
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      window.alert('Failed to renew review');
    }
  }

  @dropTask
  *completeRenew() {
    this.recentlyRenewed = true;
    yield timeout(2000);
    this.recentlyRenewed = false;
  }
}

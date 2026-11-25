import { asRecord } from 'ember-observer/utils/as-array';
import { action, set, get } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';
import { questions } from '../models/review';
import { tracked } from '@glimmer/tracking';

export default class AdminAddon extends Component {
  @service
  store;

  @tracked localAddon;

  get addon() {
    let own = this.localAddon;

    return own && own.arg === this.args.addon ? own.value : this.args.addon;
  }

  set addon(value) {
    if (value === this.addon) return;

    this.localAddon = { arg: this.args.addon, value };
    this.args.onAddonChange?.(value);
  }

  @tracked
  recentlyRenewed = false;

  @action
  updateInvalidRepoFlag(value) {
    set(this, 'addon.hasInvalidGithubRepo', !value);
  }

  @action
  updateIsWipFlag(value) {
    set(this, 'addon.isWip', !value);
  }

  @action
  updateIsDeprecatedFlag(value) {
    set(this, 'addon.isDeprecated', !value);
  }

  @action
  updateIsHiddenFlag(value) {
    set(this, 'addon.isHidden', !value);
  }

  @(task(function* () {
    try {
      yield this.addon.save();
    } catch (e) {
      window.alert('Failed to save addon');
    }
  }).drop())
  saveAddon;

  @(task(function* () {
    let newReview = this.store.createRecord('review');
    let latestReview = get(this, 'addon.latestReview');

    questions.forEach(function (question) {
      newReview.set(question.fieldName, latestReview.get(question.fieldName));
    });
    set(newReview, 'review', asRecord(get(latestReview, 'review')));
    set(newReview, 'version', asRecord(get(this, 'addon.latestAddonVersion')));

    try {
      yield newReview.save();
      set(this.addon, 'latestReview', newReview);
      yield this.addon.save();
      this.completeRenew.perform();
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      window.alert('Failed to renew review');
    }
  }).drop())
  renewLatestReview;

  @(task(function* () {
    this.recentlyRenewed = true;
    yield timeout(2000);
    this.recentlyRenewed = false;
  }).drop())
  completeRenew;
}

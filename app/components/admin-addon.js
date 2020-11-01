import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { dropTask } from 'ember-concurrency-decorators';
import { questions } from '../models/review';

export default class AdminAddon extends Component {
  @service
  store;

  @tracked recentlyRenewed = false;

  @action
  toggleFlag(name) {
    this.args.addon[name] = !this.args.addon[name];
  }

  @action
  updateCategories(categories) {
    this.args.addon.set('categories', categories);
  }

  @dropTask
  *saveAddon() {
    try {
      yield this.args.addon.save();
    } catch(e) {
      window.alert('Failed to save addon');
    }
  }

  @dropTask
  *renewLatestReview() {
    let addon = this.args.addon;
    let newReview = this.store.createRecord('review');
    let latestReview = addon.latestReview;

    questions.forEach(function(question) {
      newReview[question.fieldName] = latestReview.get(question.fieldName);
    });
    newReview.review = latestReview.get('review');
    newReview.version = addon.latestAddonVersion;

    try {
      yield newReview.save();
      addon.latestReview = newReview;
      yield addon.save();
      this.completeRenew.perform();
    } catch(e) {
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

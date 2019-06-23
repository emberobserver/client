import classic from 'ember-classic-decorator';
import { inject } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { questions } from '../models/review';

@classic
export default class AdminAddonReviewFormComponent extends Component {
  addon = null;
  reviewProperties = null;
  questions = questions;

  @inject
  @inject
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

  @task
  saveReview;

  @task
  complete;
}

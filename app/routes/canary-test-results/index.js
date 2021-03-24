import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class IndexRoute extends Route {
  @service currentDate;

  beforeModel() {
    this.transitionTo(
      'canary-test-results.date',
      moment(this.currentDate.date).format('YYYY-MM-DD')
    );
  }
}

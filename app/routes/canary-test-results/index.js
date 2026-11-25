import Route from '@ember/routing/route';
import { service } from '@ember/service';
import moment from 'moment';

export default class IndexRoute extends Route {
  @service router;

  @service currentDate;

  beforeModel() {
    this.router.transitionTo(
      'canary-test-results.date',
      moment(this.currentDate.date).format('YYYY-MM-DD')
    );
  }
}

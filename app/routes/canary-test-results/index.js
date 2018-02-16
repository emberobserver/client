import Route from '@ember/routing/route';
import moment from 'moment';

export default Route.extend({
  beforeModel() {
    this.transitionTo('canary-test-results.date', moment().format('YYYY-MM-DD'));
  }
});

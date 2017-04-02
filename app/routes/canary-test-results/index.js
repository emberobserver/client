import Ember from 'ember';
import moment from 'moment';

export default Ember.Route.extend({
  beforeModel() {
    this.transitionTo('canary-test-results.date', moment().format('YYYY-MM-DD'));
  }
});

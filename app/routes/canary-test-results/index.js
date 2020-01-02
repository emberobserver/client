import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import moment from 'moment';

@classic
export default class IndexRoute extends Route {
  beforeModel() {
    this.transitionTo('canary-test-results.date', moment().format('YYYY-MM-DD'));
  }
}

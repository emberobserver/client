import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

@classic
export default class AdminRoute extends Route {
  @service session;

  beforeModel() {
    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('index');
    }
  }

  titleToken() {
    return 'Admin';
  }
}

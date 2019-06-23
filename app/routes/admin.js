import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class AdminRoute extends Route {
  beforeModel() {
    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('index');
    }
  }

  titleToken() {
    return 'Admin';
  }
}

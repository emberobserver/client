import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('index');
    }
  },
  titleToken() {
    return 'Admin';
  },
});

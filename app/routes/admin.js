import Ember from 'ember';
import scrollFix from '../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  beforeModel() {
    if (!this.get('session.isAuthenticated')) {
      this.transitionTo('index');
    }
  }
});

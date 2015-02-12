import Ember from 'ember';
import scrollFix from '../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  beforeModel: function() {
    if(!this.get('session.isAuthenticated')) {
      this.transitionTo('index');
    }
  }
});

import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model: function(params){
    return this.store.find('category', params.name);
  },

  actions: {
    error: function() {
      this.transitionTo('/not-found');
    }
  }
});

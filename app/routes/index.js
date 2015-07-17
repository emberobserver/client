import Ember from 'ember';
import scrollFix from '../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model: function() {
    return this.modelFor('application').categories;
  }
});

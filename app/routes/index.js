import Ember from 'ember';
import scrollFix from '../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model() {
    return this.modelFor('application').categories;
  }
});

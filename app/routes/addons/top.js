import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model: function() {
    return this.modelFor('application').addons.filter(function(addon) {
      return addon.get('ranking');
    }).sortBy('ranking');
  }
});

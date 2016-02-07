import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.modelFor('application').addons.filter(function(addon) {
      return addon.get('ranking');
    }).sortBy('ranking');
  }
});

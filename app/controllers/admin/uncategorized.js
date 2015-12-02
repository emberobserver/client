import Ember from 'ember';

export default Ember.Controller.extend({
	allAddons: Ember.computed.alias('model'),
	uncategorizedAddons: Ember.computed('allAddons.@each.categories.length', function() {
		return this.get('allAddons').filter(function(addon) {
      return addon.get('categories.length') === 0;
    }).sortBy('latestVersionDate').reverse();
	})
});

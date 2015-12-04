import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return this.store.peekAll('addon').filter(function(addon) {
			return addon.get('categories.length') === 0;
		});
	}
});

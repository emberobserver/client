import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: {
		addonSortKey: 'sort'
	},
	addonSortKey: 'score',

	hasSubcategories: function() {
		return this.get('model.subcategories.length') > 0;
	}.property('model.subcategories')
});

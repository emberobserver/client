import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: {
		addonSortKey: 'sort'
	},
	addonSortKey: 'score',
	sortedAddons: Ember.computed.sort('model.addons', 'addonSorting'),

	hasSubcategories: function() {
		return this.get('model.subcategories.length') > 0;
	}.property('model.subcategories'),

	addonSorting: function() {
		var sortKeyMapping = {
			'latestVersionDate': 'latestVersionDate:desc',
			'name': 'name:asc',
			'score': 'score:desc',
		};
		var sortKey = sortKeyMapping[ this.get('addonSortKey') ] || 'score:desc';
		return [ sortKey ];
	}.property('addonSortKey')
});

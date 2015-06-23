import Ember from 'ember';

export default Ember.Component.extend({
	category: null,
	prefix: '',

	subcategorySorting: [ 'position:asc' ],
	sortedSubcategories: Ember.computed.sort('category.subcategories', 'subcategorySorting')
});

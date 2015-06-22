import Ember from 'ember';

export default Ember.Controller.extend({
	categorySorting: [ 'position:asc' ],

	categories: Ember.computed.alias('model.categories'),
	category: Ember.computed.alias('model.category'),

	categoryName: Ember.computed.oneWay('category.name'),
	categoryDescription: Ember.computed.oneWay('category.description'),
	categoryPosition: Ember.computed.oneWay('category.position'),

	subcategories: Ember.computed.sort('category.subcategories', 'categorySorting'),
	siblingCategories: Ember.computed.filter('categories', function(item) {
		return item.get('parent.id') === this.get('category.parent.id');
	}),
	sortedSiblingCategories: Ember.computed.sort('siblingCategories', 'categorySorting'),
	hasSiblingCategories: Ember.computed.gt('siblingCategories.length', 1),

	actions: {
		updateCategory: function() {
			let category = this.get('category');
			category.set('name', this.get('categoryName'));
			category.set('description', this.get('categoryDescription'));
			category.set('position', this.get('categoryPosition'));
			category.save().then(() => this.transitionToRoute('admin.index'));
		}
	}
});

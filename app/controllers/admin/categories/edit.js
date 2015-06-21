import Ember from 'ember';

export default Ember.Controller.extend({
	categoryName: Ember.computed.oneWay('model.name'),
	categoryDescription: Ember.computed.oneWay('model.description'),

	actions: {
		updateCategory: function() {
			let category = this.get('model');
			category.set('name', this.get('categoryName'));
			category.set('description', this.get('categoryDescription'));
			category.save().then(() => this.transitionToRoute('admin.index'));
		}
	}
});

import Ember from 'ember';

export default Ember.Controller.extend({
	newCategoryName: '',
	newCategoryDescription: '',
	newCategoryPosition: '',

	actions: {
		addCategory: function(name, description) {
			console.log("Adding %s [%s] at position %s", this.get('newCategoryName'), this.get('newCategoryDescription'), this.get('newCategoryPosition'));
			let newCategory = this.store.createRecord('category', {
				name: this.get('newCategoryName'),
				description: this.get('newCategoryDescription')
			});
			newCategory.save().then(() => this.transitionToRoute('admin'));
		}
	}
});

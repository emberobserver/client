import Ember from 'ember';

export default Ember.Controller.extend({
	hasSubcategories: function() {
		return this.get('model.categories.length') > 0;
	}.property('model.categories')
});

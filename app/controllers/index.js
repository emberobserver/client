import Ember from 'ember';

export default Ember.Controller.extend({
	topLevelCategories: Ember.computed.filterBy('model', 'parent', null)
});

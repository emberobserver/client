import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'select',
	attributeBindings: [ 'value' ],
	categories: [ ],
	position: -1,

	change: function() {
		this.set('position', this.$().val());
	},

	didInsertElement: function() {
		this.set('position', this.$().val());
	}
});

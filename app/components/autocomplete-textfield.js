import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'input',
	placeholder: '',
	type: 'text',
	attributeBindings: [ 'placeholder', 'type' ],

	items: null,
	displayKey: '',

	didInsertElement: function() {
		var component = this;
		var $input = this.$();

		var displayKey = this.get('displayKey');
		var select = function(_, ui) {
			var selected = ui.item.value;
			component.trigger('selected', selected);
		};
		var source = this.get('items').map(function(item) { return item.get(displayKey); });
		$input.autocomplete({
			select, source
		});
	},

	keyPress: function(event) {
		if (event.keyCode === 13) {
			this.trigger('selected', event.target.value);
		}
	},

	selected: function(value) {
		var displayKey = this.get('displayKey');
		var item = this.get('items').findBy(displayKey, value);
		if (item) {
			this.sendAction('select', item);
		}
	}
});

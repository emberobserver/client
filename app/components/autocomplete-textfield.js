import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'input',
	placeholder: '',
	type: 'text',
	value: '',
	attributeBindings: [ 'placeholder', 'type', 'value' ],

	items: null,
	displayKey: '',

	didInsertElement: function() {
		var component = this;
		var $input = this.$();

		var displayKey = this.get('displayKey');
		var select = function(_, ui) {
			var selected = ui.item.value;
			var item = component.get('items').findBy(displayKey, selected);
			console.dir(item);
			component.sendAction('select', item);
		};
		var source = this.get('items').map(function(item) { return item.get(displayKey); });
		$input.autocomplete({
			select, source
		});
	}
});

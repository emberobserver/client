import Ember from 'ember';

export default Ember.Component.extend({

	items: null,
	displayKey: '',
  placeholder: 'Search',

	didInsertElement: function() {
		var component = this;
		var $input = this.$('#typeahead');

		var displayKey = this.get('displayKey');

		var source = this.get('items').map(function(item) { return item.get(displayKey); });
    $input.typeahead({
      hint: true,
      maxItem: 15,
      source: {
        data: source
      },
      callback: {
        onClick: function (node, a, selected) {
          component.selected(selected.display);
        },
        onSubmit: function(node, form, selected){

          if(selected){
            component.selected(selected.display);
          }
          else {
            var searchText = $input.val();
            if(source.indexOf(searchText)){
              component.selected(searchText);
            }
          }
        }
      }
    });
	},
  selected: function(value) {
    var displayKey = this.get('displayKey');
    var item = this.get('items').findBy(displayKey, value);
    if (item) {
      this.sendAction('select', item);
    }
  }
});

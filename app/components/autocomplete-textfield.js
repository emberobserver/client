import Ember from 'ember';

export default Ember.Component.extend({

	items: null,
  placeholder: 'Search',

	didInsertElement: function() {
		var component = this;
		var $input = this.$('input');

		var source = this.get('items').map(function(item) {
      return {
        name: item.get('name')
      }
    });
    $input.typeahead({
      highlight: true,
      hint: true
    }, {
      name: 'addons',
      displayKey: 'name',
      source: substringMatcher(source)
    }).on('typeahead:selected typeahead:autocompleted', Ember.run.bind(this, function(e, obj, dataSet){
      this.selected(obj);
      $input.typeahead('close');
    }));
	},

  keyUp: function(event){
    if(event.which == 13){
      this.$(".tt-suggestion:first-child").click();
    }
  },

  selected: function(value) {
    var item = this.get('items').findBy('name', value.name);
    if (item) {
      this.sendAction('select', item);
    }
  },

  cleanup: Ember.observer(function(){
    this.$(input).typeahead('destroy');
  }).on('willDestroyElement')
});

function substringMatcher(strs) {
  return function findMatches(query, callback) {
    var matcher = new RegExp( query, "i" );
    var results = strs.filter( function ( item ) {
      return matcher.test( item.name );
    });
    callback(results);
  };
}

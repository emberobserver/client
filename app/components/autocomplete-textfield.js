import Ember from 'ember';

export default Ember.Component.extend({
  placeholder: 'Search',

	didInsertElement: function() {
		var component = this;
		var $input = this.$('input');

		var addons = this.get('datasets.addons.data').map(function(item){
      return {
        name: item.get( component.get('datasets.addons.key') )
      };
    });

    this.set('addonsAction', this.get('datasets.addons.action'));
    this.set('categoriesAction', this.get('datasets.categories.action'));
    var categories = this.get('datasets.categories.data').map(function(item){
      return {
        name: item.get( component.get('datasets.categories.key') )
      };
    });

    $input.typeahead({
      highlight: true,
      hint: true
    }, {
      name: 'addons',
      displayKey: 'name',
      source: substringMatcher(addons),
      templates: {
        header: '<h3>Addons</h3>'
      }
    }, {
      name: 'categories',
      displayKey: 'name',
      source: substringMatcher(categories),
      templates: {
        header: '<h3>Categories</h3>'
      }
    }).on('typeahead:selected typeahead:autocompleted', Ember.run.bind(this, function(e, obj, dataSet){
      this.selected(obj, dataSet);
      $input.typeahead('close');
    }));
	},

  keyUp: function(event){
    if(event.which == 13 && !this.$(".tt-cursor").length){
      this.$(".tt-suggestion:first-child").click();
    }
  },

  selected: function(value, dataset) {
    var item = this.get(`datasets.${dataset}.data`).findBy('name', value.name);
    if (item) {
      this.sendAction(`${dataset}Action`, item);
    }
  },

  willDestroyElement: function(){
    this.$('input').typeahead('destroy');
  }
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

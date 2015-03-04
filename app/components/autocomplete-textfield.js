import Ember from 'ember';

export default Ember.Component.extend({
  placeholder: 'Search',

	didInsertElement: function() {
		var component = this;
    var dataset, data;
		var $input = this.$('input');
    var typeaheadOptions = [];

    typeaheadOptions.push({
      highlight: true,
      hint: true,
      minLength: 2
    });

    var keys = Object.keys(this.get('datasets'));
    var tmp;
    keys.forEach(function(datasetName){
      dataset = component.get(`datasets.${datasetName}`);
      component.set(`${datasetName}Action`, dataset.action);
      data = dataset.data.map(function(item){
        tmp = {
          display: item.get( dataset.key ),
          id: item.get('id')
        };
        if(item.get('score') !== undefined){
          tmp.score = item.get('score');
        }
        return tmp;
      });

      typeaheadOptions.push({
        name: datasetName,
        displayKey: 'display',
        source: substringMatcher(data),
        templates: {
          header: `<h3>${datasetName.capitalize()}</h3>`,
          suggestion: function(properties){
            if( properties.score !== undefined ){
              return `<p><span class="score" data-score="${properties.score}">${properties.score}</span> ${properties.display}</p>`;
            }
            return `<p>${properties.display}</p>`;
          }
        }
      });
    });

    $input.typeahead.apply($input, typeaheadOptions)
      .on('typeahead:selected typeahead:autocompleted', Ember.run.bind(this, function(e, obj, dataSet){
        this.selected(obj, dataSet);
        $input.typeahead('close');
      }));
	},

  keyUp: function(event){
    if(event.which === 13 && !this.$(".tt-cursor").length){
      this.$(".tt-suggestion:first-child").click();
    }
  },

  selected: function(value, datasetName) {
    var item = this.get(`datasets.${datasetName}.data`).findBy('id', value.id);
    if (item) {
      this.sendAction(`${datasetName}Action`, item);
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
      return matcher.test( item.display );
    });
    callback(results);
  };
}

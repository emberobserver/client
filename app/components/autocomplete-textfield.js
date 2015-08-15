import Ember from 'ember';

export default Ember.Component.extend({
  placeholder: 'Search',
  autofocus: false,

  didInsertElement() {
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
    keys.forEach(function(datasetName) {
      dataset = component.get(`datasets.${datasetName}`);
      component.set(`${datasetName}Action`, dataset.action);
      data = dataset.data.map(function(item) {
        tmp = {
          display: item.get(dataset.key),
          id: item.get('id')
        };
        if (item.get('isAddon')) {
          tmp.isAddon = item.get('isAddon');
          tmp.displayHtml = displayHtml(item, tmp);
        }
        return tmp;
      });

      typeaheadOptions.push({
        name: datasetName,
        displayKey: 'display',
        source: substringMatcher(data),
        templates: {
          header: `<h3>${datasetName.capitalize()}</h3>`,
          suggestion(properties) {
            if (properties.isAddon) {
              return `<p>${properties.displayHtml}</p>`;
            }
            return `<p>${properties.display}</p>`;
          }
        }
      });
    });

    $input.typeahead.apply($input, typeaheadOptions)
      .on('typeahead:selected typeahead:autocompleted', Ember.run.bind(this, function(e, obj, dataSet) {
        this.selected(obj, dataSet);
        $input.typeahead('close');
      }));

    if (this.get('autofocus')) {
      $input.focus();
    }
  },

  selected(value, datasetName) {
    var item = this.get(`datasets.${datasetName}.data`).findBy('id', value.id);
    if (item) {
      this.sendAction(`${datasetName}Action`, item);
    }
  },

  willDestroyElement() {
    this.$('input').typeahead('destroy');
  },

  actions: {
    submit() {
      this.$('.tt-suggestion:first-child').click();
    }
  }
});

function substringMatcher (strs) {
  return function findMatches (query, callback) {
    var emMatcher = /(^e$|^em$|^emb$|^embe$|^ember$)/;
    if (emMatcher.test(query)) {
      return callback([]);
    }

    query = escapeForRegex(query);
    var matcher = new RegExp(query, 'i');
    var results = strs.filter(function(item) {
      return matcher.test(item.display);
    });
    callback(results);
  };
}

function escapeForRegex (str) {
  return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
}

function displayHtml (addon, result) {
  var base = `${result.display}`;
  if (addon.get('isDeprecated')) {
    base = `${base} <span class="notice">(DEPRECATED)</span>`;
  }
  if (addon.get('isWip')) {
    return `<span class="score">WIP</span> ${base}`;
  }
  if (addon.get('score') !== undefined && addon.get('score') !== null) {
    return `<span class="score" data-score="${addon.get('score')}">${addon.get('score')}</span> ${base}`;
  }
  return `<span class="score">N/A</span> ${base}`;
}

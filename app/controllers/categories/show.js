import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: {
    addonSortKey: 'sort'
  },
  addonSortKey: 'score',
  sortedAddons: Ember.computed.sort('model.addons', 'addonSorting'),

  hasSubcategories: function() {
    return this.get('model.subcategories.length') > 0;
  }.property('model.subcategories'),

  addonSorting: function() {
    var sortKeyMapping = {
      'latestVersionDate': ['latestVersionDate:desc'],
      'name': ['name:asc'],
      'score': ['isDeprecated:asc', 'score:desc']
    };
    var sortKey = sortKeyMapping[this.get('addonSortKey')] || sortKeyMapping['score'];
    return sortKey;
  }.property('addonSortKey'),

  actions: {
    sortBy: function(key) {
      this.set('addonSortKey', key);
    }
  }
});

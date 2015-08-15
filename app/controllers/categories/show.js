import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: {
    addonSortKey: 'sort'
  },
  addonSortKey: 'score',
  sortedAddons: Ember.computed.sort('model.addons', 'addonSorting'),

  hasSubcategories: Ember.computed('model.subcategories', function() {
    return this.get('model.subcategories.length') > 0;
  }),

  addonSorting: Ember.computed('addonSortKey', function() {
    var sortKeyMapping = {
      'latestVersionDate': ['latestVersionDate:desc'],
      'name': ['name:asc'],
      'score': ['isDeprecated:asc', 'score:desc']
    };
    var sortKey = sortKeyMapping[this.get('addonSortKey')] || sortKeyMapping['score'];
    return sortKey;
  }),

  actions: {
    sortBy: function(key) {
      this.set('addonSortKey', key);
    }
  }
});

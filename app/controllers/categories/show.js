import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: {
    addonSortKey: 'sort'
  },
  addonSortKey: 'score',
  category: Ember.computed.alias('model.category'),
  addons: Ember.computed.alias('model.addons'),
  sortedAddons: Ember.computed.sort('addons', 'addonSorting'),

  hasSubcategories: Ember.computed('category.subcategories', function() {
    return this.get('category.subcategories.length') > 0;
  }),

  addonSorting: Ember.computed('addonSortKey', function() {
    let sortKeyMapping = {
      'latestVersionDate': ['latestVersionDate:desc'],
      'name': ['name:asc'],
      'score': ['isDeprecated:asc', 'score:desc']
    };
    let sortKey = sortKeyMapping[this.get('addonSortKey')] || sortKeyMapping.score;
    return sortKey;
  }),

  actions: {
    sortBy(key) {
      this.set('addonSortKey', key);
    }
  }
});

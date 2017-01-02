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
    let sortKeyMapping = {
      'latestVersionDate': ['latestVersionDate:desc'],
      'name': ['name:asc'],
      'score': ['isDeprecated:asc', 'score:desc']
    };
    let sortKey = sortKeyMapping[this.get('addonSortKey')] || sortKeyMapping.score;
    return sortKey;
  }.property('addonSortKey'),

  actions: {
    sortBy(key) {
      this.set('addonSortKey', key);
    }
  }
});

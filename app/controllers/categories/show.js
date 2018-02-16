import { computed } from '@ember/object';
import { alias, sort } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: {
    addonSortKey: 'sort'
  },
  addonSortKey: 'score',
  category: alias('model.category'),
  addons: alias('model.addons'),
  sortedAddons: sort('addons', 'addonSorting'),

  hasSubcategories: computed('category.subcategories', function() {
    return this.get('category.subcategories.length') > 0;
  }),

  addonSorting: computed('addonSortKey', function() {
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

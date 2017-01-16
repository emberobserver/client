import Ember from 'ember';

export default Ember.Component.extend({
  categorySorting: ['position:asc'],
  categoryLinkRoute: 'categories.show',
  topLevelCategories: Ember.computed.filterBy('categories', 'parent', null),
  sortedTopLevelCategories: Ember.computed.sort('topLevelCategories', 'categorySorting')
});

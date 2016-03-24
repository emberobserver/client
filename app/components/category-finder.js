import Ember from 'ember';

export default Ember.Component.extend({
  categorySorting: ['position:asc'],
  topLevelCategories: Ember.computed.filterBy('categories', 'parent', null),
  sortedTopLevelCategories: Ember.computed.sort('topLevelCategories', 'categorySorting')
});

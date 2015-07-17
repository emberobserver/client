import Ember from 'ember';

export default Ember.Controller.extend({
  categorySorting: ['position:asc'],
  topLevelCategories: Ember.computed.filterBy('model', 'parent', null),
  sortedTopLevelCategories: Ember.computed.sort('topLevelCategories', 'categorySorting')
});

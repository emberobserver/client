import Ember from 'ember';

export default Ember.Controller.extend({
  categorySorting: ['position:desc'],
  unsortedTopLevelCategories: Ember.computed.filterBy('model', 'parent', null),
  topLevelCategories: Ember.computed.sort('unsortedTopLevelCategories', 'categorySorting'),
});

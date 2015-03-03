import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  classNames: ['category-list'],

  categorySorting: [ 'addonCount:desc' ],
  categoriesSortedByAddonCount: Ember.computed.sort('categories', 'categorySorting')
});

import { sort } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  categories: null,
  addon: null,
  categorySorting: ['displayName:asc'],
  sortedCategories: sort('categories', 'categorySorting')
});

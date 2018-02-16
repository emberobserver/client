import { sort } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',
  classNames: ['category-list', 'test-category-list'],

  categorySorting: ['totalAddonCount:desc'],
  categoriesSortedByAddonCount: sort('categories', 'categorySorting')
});

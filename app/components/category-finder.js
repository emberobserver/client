import { filterBy, sort } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  categorySorting: ['position:asc'],
  categoryLinkRoute: 'categories.show',
  topLevelCategories: filterBy('categories', 'parent', null),
  sortedTopLevelCategories: sort('topLevelCategories', 'categorySorting')
});

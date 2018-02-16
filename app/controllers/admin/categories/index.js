import { filterBy, sort } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  categorySorting: ['position:desc'],
  unsortedTopLevelCategories: filterBy('model', 'parent', null),
  topLevelCategories: sort('unsortedTopLevelCategories', 'categorySorting')
});

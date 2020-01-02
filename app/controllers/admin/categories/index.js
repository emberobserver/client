import classic from 'ember-classic-decorator';
import { sort, filterBy } from '@ember/object/computed';
import Controller from '@ember/controller';

@classic
export default class IndexController extends Controller {
  categorySorting = ['position:desc'];

  @filterBy('model', 'parent', null)
  unsortedTopLevelCategories;

  @sort('unsortedTopLevelCategories', 'categorySorting')
  topLevelCategories;
}

import classic from 'ember-classic-decorator';
import { sort, filterBy } from '@ember/object/computed';
import Component from '@ember/component';

@classic
export default class CategoryFinder extends Component {
  categorySorting = ['position:asc'];
  categoryLinkRoute = 'categories.show';

  @filterBy('categories', 'parent', null)
  topLevelCategories;

  @sort('topLevelCategories', 'categorySorting')
  sortedTopLevelCategories;
}

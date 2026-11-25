import Component from '@ember/component';
import { get } from '@ember/object';
import asArray, { sortBy } from 'ember-observer/utils/as-array';

export default class CategoryFinder extends Component {
  categorySorting = ['position:asc'];
  categoryLinkRoute = 'categories.show';

  get topLevelCategories() {
    return asArray(get(this, 'categories')).filter((item) => item.parent === null);
  }

  get sortedTopLevelCategories() {
    return sortBy(get(this, 'topLevelCategories'), get(this, 'categorySorting'));
  }
}

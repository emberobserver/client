import { classNames, tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { get } from '@ember/object';
import { sortBy } from 'ember-observer/utils/as-array';

@tagName('span')
@classNames('category-list', 'test-category-list')
export default class InlineCategoryList extends Component {
  categorySorting = ['totalAddonCount:desc'];

  get categoriesSortedByAddonCount() {
    return sortBy(get(this, 'categories'), get(this, 'categorySorting'));
  }
}

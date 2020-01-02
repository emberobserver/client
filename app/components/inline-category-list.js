import classic from 'ember-classic-decorator';
import { classNames, tagName } from '@ember-decorators/component';
import { sort } from '@ember/object/computed';
import Component from '@ember/component';

@classic
@tagName('span')
@classNames('category-list', 'test-category-list')
export default class InlineCategoryList extends Component {
  categorySorting = ['totalAddonCount:desc'];

  @sort('categories', 'categorySorting')
  categoriesSortedByAddonCount;
}

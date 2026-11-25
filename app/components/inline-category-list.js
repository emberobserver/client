import Component from '@glimmer/component';
import { get } from '@ember/object';
import { sortBy } from 'ember-observer/utils/as-array';

export default class InlineCategoryList extends Component {
  categorySorting = ['totalAddonCount:desc'];

  get categoriesSortedByAddonCount() {
    return sortBy(get(this.args, 'categories'), get(this, 'categorySorting'));
  }
}

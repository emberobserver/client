import Component from '@glimmer/component';
import { get } from '@ember/object';
import { sortBy } from 'ember-observer/utils/as-array';

export default class CategoryChooser extends Component {
  get categories() {
    return this.args.categories;
  }

  get addon() {
    return this.args.addon;
  }

  categorySorting = ['displayName:asc'];

  get sortedCategories() {
    return sortBy(get(this, 'categories'), get(this, 'categorySorting'));
  }
}

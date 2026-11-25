import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { get } from '@ember/object';
import { sortBy } from 'ember-observer/utils/as-array';

@tagName('')
export default class CategoryChooser extends Component {
  categories = null;
  addon = null;
  categorySorting = ['displayName:asc'];

  get sortedCategories() {
    return sortBy(get(this, 'categories'), get(this, 'categorySorting'));
  }
}

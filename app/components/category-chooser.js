import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { sort } from '@ember/object/computed';
import Component from '@ember/component';

@classic
@tagName('')
export default class CategoryChooser extends Component {
  categories = null;
  addon = null;
  categorySorting = ['displayName:asc'];

  @sort('categories', 'categorySorting')
  sortedCategories;
}

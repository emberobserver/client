import classic from 'ember-classic-decorator';
import Controller from '@ember/controller';
import { get } from '@ember/object';
import asArray, { sortBy } from 'ember-observer/utils/as-array';

@classic
export default class IndexController extends Controller {
  categorySorting = ['position:desc'];

  get unsortedTopLevelCategories() {
    return asArray(get(this, 'model')).filter((item) => item.parent === null);
  }

  get topLevelCategories() {
    return sortBy(get(this, 'unsortedTopLevelCategories'), get(this, 'categorySorting'));
  }
}

import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { sort, alias } from '@ember/object/computed';
import Controller from '@ember/controller';

@classic
export default class ShowController extends Controller {
  queryParams = {
    addonSortKey: 'sort'
  };

  addonSortKey = 'score';

  @alias('model.category')
  category;

  @alias('model.addons')
  addons;

  @sort('addons', 'addonSorting')
  sortedAddons;

  @computed('category.subcategories')
  get hasSubcategories() {
    return this.get('category.subcategories.length') > 0;
  }

  @computed('addonSortKey')
  get addonSorting() {
    let sortKeyMapping = {
      'latestVersionDate': ['latestVersionDate:desc'],
      'name': ['name:asc'],
      'score': ['isDeprecated:asc', 'score:desc']
    };
    let sortKey = sortKeyMapping[this.addonSortKey] || sortKeyMapping.score;
    return sortKey;
  }

  @action
  sortBy(key) {
    this.set('addonSortKey', key);
  }
}

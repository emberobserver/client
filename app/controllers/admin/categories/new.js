import classic from 'ember-classic-decorator';
import { action, get } from '@ember/object';
import Controller from '@ember/controller';
import { service } from '@ember/service';
import asArray, { sortBy } from 'ember-observer/utils/as-array';

@classic
export default class NewController extends Controller {
  @service router;

  @service store;

  newCategoryName = '';
  newCategoryDescription = '';
  newCategoryPosition = '';
  categorySorting = ['position:asc'];

  get topLevelCategories() {
    return asArray(get(this, 'model.categories')).filter((item) => item.parent === null);
  }

  get sortedTopLevelCategories() {
    return sortBy(get(this, 'topLevelCategories'), get(this, 'categorySorting'));
  }

  @action
  addCategory() {
    let newCategory = this.store.createRecord('category', {
      name: this.newCategoryName,
      description: this.newCategoryDescription,
      position: this.newCategoryPosition,
    });
    newCategory
      .save()
      .then(() => {
        this.router.transitionTo('admin.categories.index');
      })
      .catch((message) => {
        newCategory.deleteRecord();
        alert(message);
      });
  }
}

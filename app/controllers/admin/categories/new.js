import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { sort, filterBy } from '@ember/object/computed';
import Controller from '@ember/controller';

@classic
export default class NewController extends Controller {
  newCategoryName = '';
  newCategoryDescription = '';
  newCategoryPosition = '';
  categorySorting = ['position:asc'];

  @filterBy('model.categories', 'parent', null)
  topLevelCategories;

  @sort('topLevelCategories', 'categorySorting')
  sortedTopLevelCategories;

  @action
  addCategory() {
    let newCategory = this.store.createRecord('category', {
      name: this.newCategoryName,
      description: this.newCategoryDescription,
      position: this.newCategoryPosition
    });
    newCategory.save().then(() => {
      this.transitionToRoute('admin.categories.index');
    }).catch((message) => {
      newCategory.deleteRecord();
      alert(message);
    });
  }
}

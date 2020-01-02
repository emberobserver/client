import { filterBy, sort } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  newCategoryName: '',
  newCategoryDescription: '',
  newCategoryPosition: '',

  categorySorting: ['position:asc'],
  topLevelCategories: filterBy('model.categories', 'parent', null),
  sortedTopLevelCategories: sort('topLevelCategories', 'categorySorting'),

  actions: {
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
});

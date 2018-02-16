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
      let newCategory = this.get('store').createRecord('category', {
        name: this.get('newCategoryName'),
        description: this.get('newCategoryDescription'),
        position: this.get('newCategoryPosition')
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

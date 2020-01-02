import { Promise as EmberPromise } from 'rsvp';
import {
  alias,
  oneWay,
  sort,
  filter,
  gt,
  empty,
  filterBy
} from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  categoryNameSorting: ['name:asc'],
  categoryPositionSorting: ['position:asc'],

  categories: alias('model.categories'),
  category: alias('model.category'),

  categoryDescription: oneWay('category.description'),
  categoryName: oneWay('category.name'),
  categoryParent: oneWay('category.parent.id'),
  categoryPosition: oneWay('category.position'),

  subcategories: sort('category.subcategories', 'categoryPositionSorting'),
  siblingCategories: filter('categories', function(item) {
    return item.get('parent.id') === this.get('category.parent.id');
  }),
  sortedSiblingCategories: sort('siblingCategories', 'categoryPositionSorting'),
  hasSiblingCategories: gt('siblingCategories.length', 1),

  isTopLevelCategory: empty('category.parent'),

  topLevelCategories: filterBy('categories', 'parent', null),
  alphabeticTopLevelCategories: sort('topLevelCategories', 'categoryNameSorting'),

  newCategoryName: '',
  newCategoryDescription: '',
  newCategoryPosition: -1,

  actions: {
    addSubcategory() {
      let newCategory = this.store.createRecord('category', {
        name: this.newCategoryName,
        description: this.newCategoryDescription,
        position: this.newCategoryPosition,
        parent: this.category
      });
      newCategory.save().then(() => {
        this.transitionToRoute('admin.categories.index');
      }).catch((message) => {
        newCategory.deleteRecord();
        alert(message);
      });
    },
    updateCategory() {
      let category = this.category;

      let parentId = this.categoryParent;
      let position = this.categoryPosition;

      if (parentId === category.get('id')) {
        alert("You can't make a category a subcategory of itself");
        return;
      }

      if (parentId != category.get('parent.id')) {
        // when changing a category's parent, always put it at the end of the list
        position = -1;
      }

      category.set('name', this.categoryName);
      category.set('description', this.categoryDescription);
      category.set('position', position);

      let findPromise;
      if (parentId) {
        findPromise = this.store.find('category', parentId);
      } else {
        findPromise = new EmberPromise((resolve) => resolve(null));
      }

      findPromise.then(function(parentCategory) {
        category.set('parent', parentCategory);
        return category.save();
      }).then(() => {
        this.transitionToRoute('admin.categories.index');
      }).catch((message) => {
        category.rollbackAttributes();
        alert(message);
      });
    }
  }
});

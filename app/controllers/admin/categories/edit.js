import Ember from 'ember';

export default Ember.Controller.extend({
  categoryNameSorting: ['name:asc'],
  categoryPositionSorting: ['position:asc'],

  categories: Ember.computed.alias('model.categories'),
  category: Ember.computed.alias('model.category'),

  categoryDescription: Ember.computed.oneWay('category.description'),
  categoryName: Ember.computed.oneWay('category.name'),
  categoryParent: Ember.computed.oneWay('category.parent.id'),
  categoryPosition: Ember.computed.oneWay('category.position'),

  subcategories: Ember.computed.sort('category.subcategories', 'categoryPositionSorting'),
  siblingCategories: Ember.computed.filter('categories', function(item) {
    return item.get('parent.id') === this.get('category.parent.id');
  }),
  sortedSiblingCategories: Ember.computed.sort('siblingCategories', 'categoryPositionSorting'),
  hasSiblingCategories: Ember.computed.gt('siblingCategories.length', 1),

  isTopLevelCategory: Ember.computed.empty('category.parent'),

  topLevelCategories: Ember.computed.filterBy('categories', 'parent', null),
  alphabeticTopLevelCategories: Ember.computed.sort('topLevelCategories', 'categoryNameSorting'),

  newCategoryName: '',
  newCategoryDescription: '',
  newCategoryPosition: -1,

  actions: {
    addSubcategory() {
      let newCategory = this.store.createRecord('category', {
        name: this.get('newCategoryName'),
        description: this.get('newCategoryDescription'),
        position: this.get('newCategoryPosition'),
        parent: this.get('category')
      });
      newCategory.save().then(() => {
        this.transitionToRoute('admin');
        location.reload();
      }).catch((message) => {
        newCategory.deleteRecord();
        alert(message);
      });
    },
    updateCategory() {
      let category = this.get('category');

      let parentId = this.get('categoryParent');
      let position = this.get('categoryPosition');

      if (parentId === category.get('id')) {
        alert("You can't make a category a subcategory of itself");
        return;
      }

      if (parentId !== category.get('parent.id')) {
        // when changing a category's parent, always put it at the end of the list
        position = -1;
      }

      category.set('name', this.get('categoryName'));
      category.set('description', this.get('categoryDescription'));
      category.set('position', position);

      let findPromise;
      if (parentId) {
        findPromise = this.store.find('category', parentId);
      } else {
        findPromise = new Ember.RSVP.Promise((resolve) => resolve(null));
      }

      findPromise.then(function(parentCategory) {
        category.set('parent', parentCategory);
        return category.save();
      }).then(() => {
        this.transitionToRoute('admin');
        location.reload();
      }).catch((message) => {
        category.rollbackAttributes();
        alert(message);
      });
    }
  }
});

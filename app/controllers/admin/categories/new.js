import Ember from 'ember';

export default Ember.Controller.extend({
  newCategoryName: '',
  newCategoryDescription: '',
  newCategoryPosition: '',

  categorySorting: ['position:asc'],
  topLevelCategories: Ember.computed.filterBy('model.categories', 'parent', null),
  sortedTopLevelCategories: Ember.computed.sort('topLevelCategories', 'categorySorting'),

  actions: {
    addCategory: function() {
      let newCategory = this.get('store').createRecord('category', {
        name: this.get('newCategoryName'),
        description: this.get('newCategoryDescription'),
        position: this.get('newCategoryPosition')
      });
      newCategory.save().then(() => {
        this.transitionToRoute('admin');
        location.reload();
      }).catch((message) => {
        newCategory.deleteRecord();
        alert(message);
      });
    }
  }
});

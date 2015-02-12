import Ember from 'ember';

export default Ember.Controller.extend({
  addonsNeedingReview: function(){
    return this.get('model.addons').filter(function(addon){
      return addon.get('reviews.length') === 0;
    });
  }.property('model.addons.@each.reviews.length'),
  addonsNeedingCategorization: function(){
    return this.get('model.addons').filter(function(addon){
      return addon.get('categories.length') === 0;
    });
  }.property('model.addons.@each.categories.length'),
  actions: {
    showNeedingCategories: function(){
      this.set('showAddonsNeedingCategorization', true);
    },
    showNeedingReview: function(){
      this.set('showAddonsNeedingReview', true);
    }
  }
});

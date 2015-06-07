import Ember from 'ember';

export default Ember.Controller.extend({
  addonsNeedingReview: Ember.computed('model.addons.@each.reviews.length', function(){
    return this.get('model.addons').filter(function(addon){
      return addon.get('reviews.length') === 0;
    }).sortBy('latestVersionDate').reverse();
  }),
  addonsNeedingCategorization: Ember.computed('model.addons.@each.categories.length', function(){
    return this.get('model.addons').filter(function(addon){
      return addon.get('categories.length') === 0;
    }).sortBy('latestVersionDate').reverse();
  }),
  addonsWithNewUpdates: Ember.computed(
    'model.addons.@each.latestVersionDate',
    'model.addons.@each.latestReviewedVersionDate',
    function(){
      return this.get('model.addons').filter(function(addon){
        return addon.get('latestVersionDate') > addon.get('latestReviewedVersionDate');
      }).sortBy('latestVersionDate').reverse();
    }
  ),
  hiddenAddons: Ember.computed(function(){
    return this.store.findQuery('addon', {hidden: true});
  }),
  actions: {
    showNeedingCategories: function(){
      this.set('showAddonsNeedingCategorization', true);
    },
    showNeedingReview: function(){
      this.set('showAddonsNeedingReview', true);
    },
    showNewUpdates: function(){
      this.set('showAddonsWithNewUpdates', true);
    },
    showHidden: function(){
      this.set('showHiddenAddons', true);
    }
  }
});

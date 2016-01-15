import Ember from 'ember';

export default Ember.Controller.extend({
  categorySorting: ['position:desc'],
  unsortedTopLevelCategories: Ember.computed.filterBy('model.categories', 'parent', null),
  topLevelCategories: Ember.computed.sort('unsortedTopLevelCategories', 'categorySorting'),

  addonsNeedingReview: function() {
    return this.get('model.addons').filter(function(addon) {
      return addon.get('reviews.length') === 0;
    }).sortBy('latestVersionDate').reverse();
  }.property('model.addons.@each.reviews.length'),
  addonsNeedingCategorization: function() {
    return this.get('model.addons').filter(function(addon) {
      return addon.get('categories.length') === 0;
    }).sortBy('latestVersionDate').reverse();
  }.property('model.addons.@each.categories.length'),
  addonsWithNewUpdates: function() {
    return this.get('model.addons').filter(function(addon) {
      return addon.get('latestVersionDate') > addon.get('latestReviewedVersionDate');
    }).sortBy('latestVersionDate').reverse();
  }.property('model.addons.@each.latestVersionDate', 'model.addons.@each.latestReviewedVersionDate'),
  hiddenAddons: function() {
    return this.store.query('addon', { hidden: true });
  }.property(),
  sortedHiddenAddons: function() {
    return this.get('hiddenAddons').sortBy('latestVersionDate').reverse();
  }.property('hiddenAddons.[]'),
  actions: {
    showNeedingCategories() {
      this.set('showAddonsNeedingCategorization', true);
    },
    showNeedingReview() {
      this.set('showAddonsNeedingReview', true);
    },
    showNewUpdates() {
      this.set('showAddonsWithNewUpdates', true);
    },
    showHidden() {
      this.set('showHiddenAddons', true);
    }
  }
});

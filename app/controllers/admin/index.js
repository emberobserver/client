import Ember from 'ember';

export default Ember.Controller.extend({
  categorySorting: ['position:desc'],
  unsortedTopLevelCategories: Ember.computed.filterBy('model.categories', 'parent', null),
  topLevelCategories: Ember.computed.sort('unsortedTopLevelCategories', 'categorySorting'),

  nonWIPAddons: Ember.computed('model.addons.@each.isWip', function() {
    return this.get('model.addons').filterBy('isWip', false);
  }),

  addonsNeedingReview: function() {
    return this.get('model.addons').filter(function(addon) {
      return addon.get('reviews.length') === 0;
    }).sortBy('latestVersionDate').reverse();
  }.property('model.addons.@each.reviews.length'),
  addonsNeedingCategorization: function() {
    return this.get('nonWIPAddons').filter(function(addon) {
      return addon.get('categories.length') === 0;
    }).sortBy('latestVersionDate').reverse();
  }.property('nonWIPAddons.@each.categories.length'),
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
    showNeedingCategories: function() {
      this.set('showAddonsNeedingCategorization', true);
    },
    showNeedingReview: function() {
      this.set('showAddonsNeedingReview', true);
    },
    showNewUpdates: function() {
      this.set('showAddonsWithNewUpdates', true);
    },
    showHidden: function() {
      this.set('showHiddenAddons', true);
    }
  }
});

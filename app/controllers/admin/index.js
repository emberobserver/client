import Ember from 'ember';

export default Ember.Controller.extend({
  categorySorting: ['position:desc'],
  unsortedTopLevelCategories: Ember.computed.filterBy('model.categories', 'parent', null),
  topLevelCategories: Ember.computed.sort('unsortedTopLevelCategories', 'categorySorting'),

  workInProgressAddons: Ember.computed('model.addons.@each.isWip', function() {
    return this.get('model.addons').filterBy('isWip', true).sortBy('latestVersionDate').reverse();
  }),

  nonWIPAddons: Ember.computed('model.addons.@each.isWip', function() {
    return (this.get('model.addons') || []).filterBy('isWip', false);
  }),

  reviewedAddons: Ember.computed('model.addons.@each.latestReviewedVersionDate', function() {
    return this.get('model.addons').filter(function(addon) {
      return !!addon.get('latestReviewedVersionDate');
    });
  }),

  addonsNeedingReview: Ember.computed('nonWIPAddons.@each.reviews', function() {
    return this.get('nonWIPAddons').filter(function(addon) {
      return addon.get('reviews.length') === 0;
    }).sortBy('latestVersionDate').reverse();
  }),
  addonsNeedingCategorization: Ember.computed('nonWIPAddons.@each.categories', function() {
    return this.get('nonWIPAddons').filter(function(addon) {
      return addon.get('categories.length') === 0;
    }).sortBy('latestVersionDate').reverse();
  }),
  addonsWithNewUpdates: Ember.computed(
    'reviewedAddons.@each.latestVersionDate',
    'reviewedAddons.@each.latestReviewedVersionDate',
    function() {
      return this.get('reviewedAddons').filter(function(addon) {
        return addon.get('latestVersionDate') > addon.get('latestReviewedVersionDate');
      }).sortBy('latestVersionDate').reverse();
    }
  ),
  hiddenAddons: Ember.computed(function() {
    return this.get('store').query('addon', { hidden: true });
  }),
  sortedHiddenAddons: Ember.computed('hiddenAddons.[]', function() {
    return this.get('hiddenAddons').sortBy('latestVersionDate').reverse();
  }),

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
    },
    showWIPAddons() {
      this.set('showWIPAddons', true);
    }
  }
});

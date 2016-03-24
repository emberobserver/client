import Ember from 'ember';

export default Ember.Component.extend({
  addonSets: Ember.inject.service('addon-sets'),
  topAddons: Ember.computed(function() {
    return this.get('addonSets.top').slice(0, 10);
  }),
  newAddons: Ember.computed(function() {
    return this.get('addonSets.newest').slice(0, 10);
  }),
  recentlyScoredAddons: Ember.computed(function() {
    return this.get('addonSets.recentlyReviewed').slice(0, 10);
  })
});


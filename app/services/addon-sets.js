import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  top: Ember.computed(function() {
    return this.get('store').peekAll('addon').filter(function(addon) {
      return addon.get('ranking');
    }).sortBy('ranking');
  }),
  newest: Ember.computed(function() {
    return this.get('store').peekAll('addon').sortBy('publishedDate').reverse();
  }),
  recentlyReviewed: Ember.computed(function() {
    return this.get('store').peekAll('addon').sortBy('latestReviewedVersionDate').reverse();
  })
});

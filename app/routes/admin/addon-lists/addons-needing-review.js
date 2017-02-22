import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').query('addon', { filter: { notReviewed: true, isWip: false }, sort: '-latestVersionDate' });
  }
});

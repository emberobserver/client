import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').query('addon', { page: { limit: 100 }, filter: { recentlyReviewed: true }, include: 'categories' });
  }
});

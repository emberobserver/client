import Ember from 'ember';

import RouteWithSearch from '../mixins/route-with-search';
import measure from '../utils/measure';

export default Ember.Route.extend(RouteWithSearch, {
  model() {
    return Ember.RSVP.hash({
      topAddons: this.get('store').query('addon', { page: { limit: 10 }, filter: { top: true }, sort: 'ranking', include: 'categories' }),
      newAddons: this.get('store').query('addon', { page: { limit: 10 }, sort: '-publishedDate', include: 'categories' }),
      recentlyScoredAddons: this.get('store').query('addon', { page: { limit: 10 }, filter: { recentlyReviewed: true }, include: 'categories' })
    });
  },

  afterModel: measure
});

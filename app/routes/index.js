import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import measure from '../utils/measure';

export default Route.extend({
  queryParams: {
    query: {
      replace: true
    },
    searchReadmes: {
      replace: true
    }
  },
  model() {
    return hash({
      topAddons: this.get('store').query('addon', { page: { limit: 10 }, filter: { top: true }, sort: 'ranking', include: 'categories' }),
      newAddons: this.get('store').query('addon', { page: { limit: 10 }, sort: '-publishedDate', include: 'categories' }),
      recentlyScoredAddons: this.get('store').query('addon', { page: { limit: 10 }, filter: { recentlyReviewed: true }, include: 'categories' })
    });
  },

  afterModel: measure
});

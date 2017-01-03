import Ember from 'ember';
import scrollFix from '../mixins/scroll-fix';
import RouteWithSearch from '../mixins/route-with-search';

export default Ember.Route.extend(scrollFix, RouteWithSearch, {
  model() {
    return Ember.RSVP.hash({
      topAddons: this.get('store').query('addon', { page: { limit: 10 }, filter: { top: true }, sort: 'ranking', include: 'categories' }),
      newAddons: this.get('store').query('addon', { page: { limit: 10 }, sort: '-publishedDate', include: 'categories' }),
      recentlyScoredAddons: this.get('store').query('addon', { page: { limit: 10 }, filter: { recentlyReviewed: true }, include: 'categories' })
    });
  }
});

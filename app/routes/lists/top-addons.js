import Ember from 'ember';
import measure from '../../utils/measure';

export default Ember.Route.extend({
  model() {
    return this.get('store').query('addon', { page: { limit: 100 }, filter: { top: true }, sort: 'ranking', include: 'categories' });
  },

  afterModel: measure
});

import Route from '@ember/routing/route';
import measure from '../../utils/measure';

export default Route.extend({
  model() {
    return this.store.query('addon', { page: { limit: 100 }, filter: { top: true }, sort: 'ranking', include: 'categories' });
  },

  afterModel: measure
});

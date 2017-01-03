import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model() {
    return this.get('store').query('addon', { page: { limit: 100 }, sort: '-publishedDate', include: 'categories' });
  }
});

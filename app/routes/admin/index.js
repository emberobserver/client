import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  afterModel() {
    this.store.findAll('review', { reload: true });
  }
});

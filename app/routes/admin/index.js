import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  afterModel: function() {
    this.get('store').findAll('review', { reload: true });
  }
});

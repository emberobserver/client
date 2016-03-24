import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  addonSets: Ember.inject.service(),
  model() {
    return this.get('addonSets.recentlyReviewed').slice(0, 100);
  }
});

import Ember from 'ember';
import scrollFix from '../../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model(params) {
    return Ember.RSVP.hash({
      categories: this.store.peekAll('category'),
      category: this.store.peekAll('category').findBy('slug', params.slug)
    });
  }
});

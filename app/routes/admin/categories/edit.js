import Ember from 'ember';
import scrollFix from '../../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model(params) {
    let categories = this.modelFor('admin.categories');
    return Ember.RSVP.hash({
      categories,
      category: this.get('store').peekAll('category').findBy('slug', params.slug)
    });
  }
});

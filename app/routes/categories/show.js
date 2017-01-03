import Ember from 'ember';
import scrollFix from '../../mixins/scroll-fix';

export default Ember.Route.extend(scrollFix, {
  model(params) {
    let category = this.get('store').peekAll('category').findBy('slug', params.slug);
    let addons = this.get('store').query('addon', { filter: { inCategory: category.get('id') }, include: 'categories' });
    return Ember.RSVP.hash({
      category,
      addons
    });
  },

  titleToken(model) {
    return model.category.get('name');
  },

  actions: {
    error() {
      this.replaceWith('model-not-found');
    }
  }
});

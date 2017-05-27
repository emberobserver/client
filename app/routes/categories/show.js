import Ember from 'ember';

import measure from '../../utils/measure';

export default Ember.Route.extend({
  model(params) {
    return this.modelFor('application').categories.then(() => {
      let category = this.get('store').peekAll('category').findBy('slug', params.slug);
      let addons = this.get('store').query('addon', { filter: { inCategory: category.get('id') }, include: 'categories' });
      return Ember.RSVP.hash({
        category,
        addons
      });
    });
  },

  afterModel: measure,

  titleToken(model) {
    return model.category.get('name');
  },

  actions: {
    error() {
      this.replaceWith('model-not-found');
    }
  }
});

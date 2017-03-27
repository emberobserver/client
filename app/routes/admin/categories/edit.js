import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let categories = this.modelFor('admin.categories');
    return Ember.RSVP.hash({
      categories,
      category: this.get('store').peekAll('category').findBy('slug', params.slug)
    });
  }
});

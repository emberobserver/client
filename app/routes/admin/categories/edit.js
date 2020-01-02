import { hash } from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    let categories = this.modelFor('admin.categories');
    return hash({
      categories,
      category: this.store.peekAll('category').findBy('slug', params.slug)
    });
  }
});

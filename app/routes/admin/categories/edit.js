import classic from 'ember-classic-decorator';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';

@classic
export default class EditRoute extends Route {
  model(params) {
    let categories = this.modelFor('admin.categories');
    return hash({
      categories,
      category: this.store.peekAll('category').findBy('slug', params.slug)
    });
  }
}

import classic from 'ember-classic-decorator';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

@classic
export default class EditRoute extends Route {
  @service store;

  model(params) {
    let categories = this.modelFor('admin.categories');
    return hash({
      categories,
      category: this.store.peekAll('category').findBy('slug', params.slug),
    });
  }
}

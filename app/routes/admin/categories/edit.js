import { get } from '@ember/object';
import asArray from 'ember-observer/utils/as-array';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class EditRoute extends Route {
  @service store;

  model(params) {
    let categories = this.modelFor('admin.categories');
    return hash({
      categories,
      category: asArray(this.store.peekAll('category')).find(
        (item) => get(item, 'slug') === params.slug,
      ),
    });
  }
}

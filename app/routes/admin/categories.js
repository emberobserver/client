import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CategoriesRoute extends Route {
  @service store;

  model() {
    return this.store.findAll('category');
  }
}

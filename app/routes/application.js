import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service session;

  @service store;

  beforeModel() {
    this.session.fetch();
  }

  model() {
    return {
      categories: this.store.findAll('category', {
        include: 'subcategories,parent',
      }),
    };
  }
}

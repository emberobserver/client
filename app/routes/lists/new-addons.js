import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class NewAddonsRoute extends Route {
  @service store;

  model() {
    return this.store.query('addon', {
      page: { limit: 100 },
      sort: '-publishedDate',
      include: 'categories',
    });
  }
}

import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class RecentlyScoredAddonsRoute extends Route {
  @service store;

  model() {
    return this.store.query('addon', {
      page: { limit: 100 },
      filter: { recentlyReviewed: true },
      include: 'categories',
    });
  }
}

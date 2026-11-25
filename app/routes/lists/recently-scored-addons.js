import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

@classic
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

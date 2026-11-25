import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AddonsNeedingRereviewRoute extends Route {
  @service store;

  model() {
    return this.store.query('addon', {
      filter: { needsReReview: true },
      sort: '-latestVersionDate',
    });
  }
}

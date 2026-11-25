import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AddonsNeedingReviewRoute extends Route {
  @service store;

  model() {
    return this.store.query('addon', {
      filter: { notReviewed: true, isWip: false },
      sort: '-latestVersionDate',
    });
  }
}

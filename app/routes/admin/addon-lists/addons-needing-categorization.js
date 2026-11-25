import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AddonsNeedingCategorizationRoute extends Route {
  @service store;

  model() {
    return this.store.query('addon', {
      filter: { isWip: false, notCategorized: true },
      sort: '-latestVersionDate',
    });
  }
}

import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AddonsWipRoute extends Route {
  @service store;

  model() {
    return this.store.query('addon', {
      filter: { isWip: true },
      sort: '-latestVersionDate',
    });
  }
}

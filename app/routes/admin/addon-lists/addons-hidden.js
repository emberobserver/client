import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AddonsHiddenRoute extends Route {
  @service store;

  model() {
    return this.store.query('addon', {
      filter: { hidden: true },
      sort: '-latestVersionDate',
    });
  }
}

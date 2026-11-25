import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

@classic
export default class AddonsNeedingRereviewRoute extends Route {
  @service store;

  model() {
    return this.store.query('addon', {
      filter: { needsReReview: true },
      sort: '-latestVersionDate',
    });
  }
}

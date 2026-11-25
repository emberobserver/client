import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

@classic
export default class InvalidRepoUrlRoute extends Route {
  @service store;

  model() {
    return this.store.query('addon', {
      filter: { missingRepoUrl: true },
      sort: '-latestVersionDate',
    });
  }
}

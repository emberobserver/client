import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class InvalidRepoUrlRoute extends Route {
  model() {
    return this.store.query('addon', { filter: { missingRepoUrl: true }, sort: '-latestVersionDate' });
  }
}

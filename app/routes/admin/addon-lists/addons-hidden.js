import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class AddonsHiddenRoute extends Route {
  model() {
    return this.store.query('addon', { filter: { hidden: true }, sort: '-latestVersionDate' });
  }
}

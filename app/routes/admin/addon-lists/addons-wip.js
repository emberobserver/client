import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class AddonsWipRoute extends Route {
  model() {
    return this.get('store').query('addon', { filter: { isWip: true }, sort: '-latestVersionDate' });
  }
}

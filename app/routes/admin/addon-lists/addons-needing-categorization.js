import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class AddonsNeedingCategorizationRoute extends Route {
  model() {
    return this.get('store').query('addon', { filter: { isWip: false, notCategorized: true }, sort: '-latestVersionDate' });
  }
}

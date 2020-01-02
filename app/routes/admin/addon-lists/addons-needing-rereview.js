import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class AddonsNeedingRereviewRoute extends Route {
  model() {
    return this.store.query('addon', { filter: { needsReReview: true }, sort: '-latestVersionDate' });
  }
}

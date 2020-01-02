import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class AddonsNeedingReviewRoute extends Route {
  model() {
    return this.store.query('addon', { filter: { notReviewed: true, isWip: false }, sort: '-latestVersionDate' });
  }
}

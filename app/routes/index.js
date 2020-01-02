import classic from 'ember-classic-decorator';
import { hash } from 'rsvp';
import Route from '@ember/routing/route';
import measure from '../utils/measure';

@classic
export default class IndexRoute extends Route {
  queryParams = {
    query: {
      replace: true
    },
    searchReadmes: {
      replace: true
    }
  };

  model() {
    return hash({
      topAddons: this.store.query('addon', { page: { limit: 10 }, filter: { top: true }, sort: 'ranking', include: 'categories' }),
      newAddons: this.store.query('addon', { page: { limit: 10 }, sort: '-publishedDate', include: 'categories' }),
      recentlyScoredAddons: this.store.query('addon', { page: { limit: 10 }, filter: { recentlyReviewed: true }, include: 'categories' })
    });
  }

  afterModel = measure;
}

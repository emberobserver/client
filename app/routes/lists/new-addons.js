import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class NewAddonsRoute extends Route {
  model() {
    return this.store.query('addon', { page: { limit: 100 }, sort: '-publishedDate', include: 'categories' });
  }
}

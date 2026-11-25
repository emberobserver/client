import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import measure from '../../utils/measure';
import { service } from '@ember/service';

@classic
export default class TopAddonsRoute extends Route {
  @service store;

  model() {
    return this.store.query('addon', {
      page: { limit: 100 },
      filter: { top: true },
      sort: 'ranking',
      include: 'categories',
    });
  }

  afterModel = measure;
}

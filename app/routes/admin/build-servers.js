import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class BuildServersRoute extends Route {
  @service store;

  model() {
    return this.store.findAll('build-server');
  }
}

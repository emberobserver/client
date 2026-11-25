import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

@classic
export default class ShowRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('test-result', params.id, {
      include: 'version,version.addon',
      reload: true,
    });
  }
}

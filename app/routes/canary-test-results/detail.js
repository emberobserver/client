import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class DetailRoute extends Route {
  @service store;

  model({ id }) {
    return this.store.findRecord('test-result', id, {
      include: [
        'ember-version-compatibilities',
        'version',
        'version.addon',
      ].join(','),
      reload: true,
    });
  }
}

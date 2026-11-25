import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SizeCalculationResultsShowRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('size-calculation-result', params.id, {
      include: 'version,version.addon',
      reload: true,
    });
  }
}

import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class SizeCalculationResultsShowRoute extends Route {
  model(params) {
    return this.store.findRecord('size-calculation-result', params.id, {
      include: 'version,version.addon',
      reload: true
    });
  }
}

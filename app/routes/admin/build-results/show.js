import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class ShowRoute extends Route {
  model(params) {
    return this.store.findRecord('test-result', params.id, {
      include: 'version,version.addon',
      reload: true
    });
  }
}

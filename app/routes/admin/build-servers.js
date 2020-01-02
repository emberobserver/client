import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class BuildServersRoute extends Route {
  model() {
    return this.store.findAll('build-server');
  }
}

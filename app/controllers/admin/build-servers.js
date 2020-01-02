import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Controller from '@ember/controller';

@classic
export default class BuildServersController extends Controller {
  newBuildServerName = '';

  @action
  addBuildServer() {
    this.store.createRecord('build-server', { name: this.newBuildServerName }).save();
  }
}

import { action } from '@ember/object';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class BuildServersController extends Controller {
  @tracked newBuildServerName = '';

  @action
  async save(event) {
    event.preventDefault();
    await this.store.createRecord('build-server', { name: this.newBuildServerName }).save();
    this.newBuildServerName = '';
  }
}

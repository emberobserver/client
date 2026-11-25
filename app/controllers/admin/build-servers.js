import { action } from '@ember/object';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { saveRecord } from '@warp-drive/legacy/compat/builders';

export default class BuildServersController extends Controller {
  @service store;

  @tracked newBuildServerName = '';

  @action
  async save(event) {
    event.preventDefault();
    await this.store.request(
      saveRecord(
        this.store.createRecord('build-server', {
          name: this.newBuildServerName,
        }),
      ),
    );
    this.newBuildServerName = '';
  }
}

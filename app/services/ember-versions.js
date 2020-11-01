import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class EmberVersionsService extends Service {
  @service
  store;

  @tracked versions = [];

  async fetch() {
    this.versions = await this.store.query('ember-version', {
      filter: { release: true, majorAndMinor: true }
    });
  }
}

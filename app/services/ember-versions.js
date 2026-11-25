import Service, { service } from '@ember/service';

export default class EmberVersionsService extends Service {
  @service
  store;

  versions = [];

  fetch() {
    this.store
      .query('ember-version', {
        filter: { release: true, majorAndMinor: true },
      })
      .then((emberVersions) => {
        this.set('versions', emberVersions);
      });
  }
}

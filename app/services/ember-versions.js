import classic from 'ember-classic-decorator';
import Service, { inject as service } from '@ember/service';

@classic
export default class EmberVersionsService extends Service {
  @service
  store;

  versions = [];

  fetch() {
    this.store.query('ember-version', {
      filter: { release: true, majorAndMinor: true }
    }).then((emberVersions) => {
      this.set('versions', emberVersions);
    });
  }
}

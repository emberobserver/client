import Service, { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),

  versions: [],

  fetch() {
    this.store.query('ember-version', {
      filter: { releases: true, majorAndMinor: true }
    }).then((emberVersions) => {
      this.set('versions', emberVersions);
    });
  }
});

import { hash } from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return hash({
      date: params.date,
      testResults: this.store.query('test-result', {
        fields: {
          'test-result': 'succeeded,status-message,created-at,semver-string,canary'
        },
        filter: {
          canary: true,
          date: params.date
        },
        include: [
          'ember-version-compatibilities',
          'version',
          'version.addon'
        ].join(',')
      })
    });
  }
});

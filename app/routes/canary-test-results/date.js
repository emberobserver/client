import { hash } from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return hash({
      date: params.date,
      testResults: this.store.query('test-result', {
        fields: {
          'test-results': [
            'canary',
            'created-at',
            'ember-version-compatibilities',
            'semver-string',
            'status-message',
            'succeeded',
            'version'
          ].join(',')
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

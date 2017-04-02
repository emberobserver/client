import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return Ember.RSVP.hash({
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

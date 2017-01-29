import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return Ember.RSVP.hash({
      date: params.date,
      testResults: this.store.query('test-result', { date: params.date, filter: { canary: true } })
    });
  }
});

import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    let filterParams = {
      canary: true,
      date: params.date
    };
    return Ember.RSVP.hash({
      date: params.date,
      testResults: this.store.query('test-result', { filter: filterParams })
    });
  }
});

import Ember from 'ember';
import JSONAPIAdapter from 'ember-data/adapters/json-api';

export default JSONAPIAdapter.extend({
  namespace: 'api/v2',
  coalesceFindRequests: true,
  headers: Ember.computed('session.{isAuthenticated,header}', function() {
    if (this.get('session.isAuthenticated')) {
      return this.get('session.header');
    }
  }),
  shouldBackgroundReloadRecord() {
    return false;
  },
  shouldBackgroundReloadAll() {
    return false;
  }
});

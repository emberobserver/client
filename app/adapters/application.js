import Ember from 'ember';
import ActiveModelAdapter from 'active-model-adapter';

export default ActiveModelAdapter.extend({
  namespace: 'api',
  coalesceFindRequests: true,
  headers: Ember.computed('session.{isAuthenticated,header}', function() {
    if (this.get('session.isAuthenticated')) {
      return this.get('session.header');
    }
  })
});

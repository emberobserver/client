import Ember from 'ember';
import ActiveModelAdapter from 'active-model-adapter';
import cachedAjax from '../utils/network-cache';

export default ActiveModelAdapter.extend({
  namespace: 'api',
  coalesceFindRequests: true,
  headers: Ember.computed('session.{isAuthenticated,header}', function() {
    if (this.get('session.isAuthenticated')) {
      return this.get('session.header');
    }
  }),

  ajax(url, type, options) {
    return cachedAjax(url, type, options, () => this._super(url, type, options));
  }
});

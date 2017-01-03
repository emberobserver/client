import Ember from 'ember';
import JSONAPIAdapter from 'ember-data/adapters/json-api';
import cachedAjax from '../utils/network-cache';

export default JSONAPIAdapter.extend({
  namespace: 'api/v2',
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

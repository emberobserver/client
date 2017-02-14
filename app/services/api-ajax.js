import AjaxService from 'ember-ajax/services/ajax';
import Ember from 'ember';

export default AjaxService.extend({
  session: Ember.inject.service(),

  namespace: 'api/v2',
  headers: Ember.computed('session.{isAuthenticated,header}', function() {
    if (this.get('session.isAuthenticated')) {
      return this.get('session.header');
    }
  })
});

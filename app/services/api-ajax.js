import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import AjaxService from 'ember-ajax/services/ajax';

export default AjaxService.extend({
  session: service(),

  namespace: 'api/v2',
  headers: computed('session.{isAuthenticated,header}', function() {
    if (this.get('session.isAuthenticated')) {
      return this.get('session.header');
    }
  })
});

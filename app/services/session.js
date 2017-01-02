import Ember from 'ember';
import LocalStore from '../utils/local-storage';

export default Ember.Service.extend({
  open(email, password) {
    let session = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        type: 'POST',
        url: '/api/authentication/login.json',
        data: { email, password },
        dataType: 'json',
        success: Ember.run.bind(null, resolve),
        error: Ember.run.bind(null, reject)
      });
    }).then(function(response) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        if (response.token) {
          session.set('token', response.token);
          LocalStore.save('sessionToken', response.token);
          resolve();
        } else {
          reject();
        }
      });
    }).catch(function() {
      session.clearToken();
      console.log('Failed logging in'); // eslint-disable-line no-console
    });
  },
  fetch() {
    let token = LocalStore.fetch('sessionToken');
    if (token) {
      this.set('token', token);
    }
  },
  close() {
    let session = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.ajax({
        type: 'POST',
        url: '/api/authentication/logout.json',
        dataType: 'json',
        headers: session.get('header'),
        success: Ember.run.bind(null, resolve),
        error: Ember.run.bind(null, reject)
      });
    }).finally(function() {
      session.clearToken();
    });
  },
  clearToken() {
    this.set('token', null);
    LocalStore.remove('sessionToken');
  },
  isAuthenticated: isPresent('token'),
  header: Ember.computed('token', function() {
    return { 'Authorization': `Token token=${this.get('token')}` };
  })
});

function isPresent(strProp) {
  return Ember.computed(strProp, function() {
    let str = this.get(strProp);
    return typeof str !== 'undefined' && !(/^\s*$/).test(str) && (str !== null);
  });
}

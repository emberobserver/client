import { computed } from '@ember/object';
import { bind } from '@ember/runloop';
import $ from 'jquery';
import { Promise as EmberPromise } from 'rsvp';
import Service from '@ember/service';
import LocalStore from '../utils/local-storage';

export default Service.extend({
  open(email, password) {
    let session = this;
    return new EmberPromise(function(resolve, reject) {
      $.ajax({
        type: 'POST',
        url: '/api/v2/authentication/login.json',
        data: { email, password },
        dataType: 'json',
        success: bind(null, resolve),
        error: bind(null, reject)
      });
    }).then(function(response) {
      return new EmberPromise(function(resolve, reject) {
        if (response.token) {
          session.set('token', response.token);
          LocalStore.save('sessionToken', response.token);
          resolve();
        } else {
          reject();
        }
      });
    }).catch(function(e) {
      session.clearToken();
      console.error(e);
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
    return new EmberPromise(function(resolve, reject) {
      $.ajax({
        type: 'POST',
        url: '/api/authentication/logout.json',
        dataType: 'json',
        headers: session.get('header'),
        success: bind(null, resolve),
        error: bind(null, reject)
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
  header: computed('token', function() {
    return { 'Authorization': `Token token=${this.get('token')}` };
  })
});

function isPresent(strProp) {
  return computed(strProp, function() {
    let str = this.get(strProp);
    return typeof str !== 'undefined' && !(/^\s*$/).test(str) && (str !== null);
  });
}

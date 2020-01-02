import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { Promise as EmberPromise } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import LocalStore from '../utils/local-storage';

@classic
export default class SessionService extends Service {
  @service
  api;

  open(email, password) {
    let session = this;
    return this.api.request('/authentication/login.json', { method: 'POST', data: { email, password }}).then(function(response) {
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
      console.error('Failed logging in', e); // eslint-disable-line no-console
    });
  }

  fetch() {
    let token = LocalStore.fetch('sessionToken');
    if (token) {
      this.set('token', token);
    }
  }

  close() {
    let session = this;
    return this.api.request('/authentication/logout.json', { method: 'POST' }).finally(function() {
      session.clearToken();
    });
  }

  clearToken() {
    this.set('token', null);
    LocalStore.remove('sessionToken');
  }

  @isPresent('token')
  isAuthenticated;

  @computed('token')
  get header() {
    return { 'Authorization': `Token token=${this.token}` };
  }
}

function isPresent(strProp) {
  return computed(strProp, function() {
    let str = this.get(strProp);
    return typeof str !== 'undefined' && !(/^\s*$/).test(str) && (str !== null);
  });
}

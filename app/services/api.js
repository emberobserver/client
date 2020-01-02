import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import fetch from 'fetch';

@classic
export default class ApiService extends Service {
  @service
  session;

  namespace = '/api/v2';

  @computed('session.{isAuthenticated,header}')
  get headers() {
    let defaultHeaders = {
      'Content-Type': 'application/vnd.api+json',
    };
    if (this.get('session.isAuthenticated')) {
      return Object.assign(defaultHeaders, this.get('session.header'));
    }
    return defaultHeaders;
  }

  async request(requestUrl, options = {}) {
    let defaultOptions = {
      headers: this.headers
    };

    let opts = Object.assign(defaultOptions, options);
    let url = new URL(`${this.namespace}${requestUrl}`, window.location.origin);

    if (opts.data) {
      opts.body = JSON.stringify(opts.data);
      delete opts.data;
    }

    if (opts.params) {
      url.search = new URLSearchParams(opts.params).toString();
      delete opts.params;
    }

    let response = await fetch(url, opts);
    if (!response.ok) {
      throw new Error(`Network request failed: ${response.statusText}`);
    }

    if (response.status !== 204) {
      return response.json();
    }
  }
}

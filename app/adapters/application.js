import { computed } from '@ember/object';
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { service } from '@ember/service';

export default class Application extends JSONAPIAdapter {
  @service session;

  namespace = 'api/v2';
  coalesceFindRequests = true;

  @computed('session.{isAuthenticated,header}')
  get headers() {
    if (this.get('session.isAuthenticated')) {
      return this.get('session.header');
    }
    return null;
  }

  shouldBackgroundReloadRecord() {
    return false;
  }

  shouldBackgroundReloadAll() {
    return false;
  }
}

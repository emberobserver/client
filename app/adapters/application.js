import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import JSONAPIAdapter from 'ember-data/adapters/json-api';

@classic
export default class Application extends JSONAPIAdapter {
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

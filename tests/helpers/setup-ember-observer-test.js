import { setupApplicationTest } from 'ember-qunit';
import { startMirage } from '../../initializers/ember-cli-mirage';
import LocalStore from 'ember-observer/utils/local-storage';
import mockStorage from './local-storage-mock';

export function setupEmberObserverTest(hooks) {
  LocalStore.storage = function() {
    return mockStorage;
  };

  hooks.beforeEach(function() {
    window.server = startMirage();
  });

  hooks.afterEach(function() {
    window.server.shutdown();
  });
  
  setupApplicationTest(hooks);
}

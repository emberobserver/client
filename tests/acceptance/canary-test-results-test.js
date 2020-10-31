import { currentRouteName, visit } from '@ember/test-helpers';
import Service from '@ember/service';
import { module, test } from 'qunit';
import { percySnapshot } from 'ember-percy';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';
import moment from 'moment';

module('Acceptance | canary test results', function(hooks) {
  setupEmberObserverTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:current-date', class extends Service {
      get date() {
        return moment('2020-10-31T17:14:51Z');
      }
    });
  });

  test('redirects to current day', async function(assert) {
    let addon = server.create('addon');

    let addonVersion = server.create('version', { addonId: addon.id });

    server.create('testResult', {
      versionId: addonVersion.id,
      canary: true
    });

    await visit('/canary-test-results');

    await percySnapshot('/canary-test-results/date');

    assert.equal(currentRouteName(), 'canary-test-results.date', 'transitions to canary test results date route');
  });
});

import { click, fillIn, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';
import login from 'ember-observer/tests/helpers/login';

module('Acceptance | managing build servers', function(hooks) {
  setupEmberObserverTest(hooks);

  test('not-logged-in users cannot see list of build servers', async function(assert) {
    await visit('/admin/build-servers');

    assert.equal(currentURL(), '/', 'not-logged-in users are redirected back to index page');
  });

  test('index page lists all build servers', async function(assert) {
    server.createList('buildServer', 15);

    await login();
    await visit('/admin/build-servers');

    assert.exists('.test-build-server-row', 15);
  });

  test('adding a new build server', async function(assert) {
    assert.expect(2);

    server.post('/build-servers', function(schema, request) {
      let requestBody = JSON.parse(request.requestBody);
      assert.equal(requestBody.data.attributes.name, 'new-server-name', 'makes the correct HTTP call');
      return server.create('buildServer', this.normalizedRequestAttrs());
    });

    await login();
    await visit('/admin/build-servers');

    await fillIn('.test-new-build-server-name', 'new-server-name');
    await click('.test-add-new-build-server');

    assert.exists('.test-build-server-row:contains(new-server-name)', 'displays a row for the newly-created build server');
  });
});

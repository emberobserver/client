import { click, fillIn, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { percySnapshot } from 'ember-percy';
import login from 'ember-observer/tests/helpers/login';
import { setupEmberObserverTest } from 'ember-observer/tests/helpers/setup-ember-observer-test';

module('Acceptance | Admin | Build servers', function(hooks) {
  setupEmberObserverTest(hooks);

  test('not-logged-in users cannot see list of build servers', async function(assert) {
    await visit('/admin/build-servers');

    assert.equal(currentURL(), '/', 'not-logged-in users are redirected back to index page');
  });

  test('index page lists all build servers', async function(assert) {
    server.createList('buildServer', 15);

    await login();
    await visit('/admin/build-servers');

    await percySnapshot('/admin/build-servers');

    assert.dom('[data-test-build-server]').exists({ count: 15 });
  });

  test('adding a new build server', async function(assert) {
    assert.expect(3);

    server.post('/build-servers', function({ buildServers }, request) {
      let requestBody = JSON.parse(request.requestBody);
      assert.equal(requestBody.data.attributes.name, 'new-server-name', 'makes the correct HTTP call');
      return buildServers.create(this.normalizedRequestAttrs());
    });

    await login();
    await visit('/admin/build-servers');

    await fillIn('[data-test-new-build-server-name]', 'new-server-name');
    await click('[data-test-add-new-build-server]');

    assert.dom('[data-test-build-server]').hasText('new-server-name', 'displays a row for the newly-created build server');
    assert.dom('[data-test-new-build-server-name]').hasValue('', 'server name input is cleared after save');
  });
});

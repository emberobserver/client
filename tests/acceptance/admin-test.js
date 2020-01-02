import { click, fillIn, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { percySnapshot } from 'ember-percy';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';

module('Acceptance: admin', function(hooks) {
  setupEmberObserverTest(hooks);

  test('visiting /admin not logged in', async function(assert) {
    await visit('/admin');

    assert.equal(currentURL(), '/', 'redirects to index');
  });

  test('visiting /admin', async function(assert) {
    assert.expect(3);
    let done = assert.async();

    server.post('/authentication/login.json', function(db, request) {
      let body = JSON.parse(request.requestBody);
      assert.equal(body.email, 'test@example.com');
      assert.equal(body.password, 'password123');
      done();
      return {
        token: 'abc123'
      };
    });

    await visit('/login');

    await percySnapshot('/login');

    await fillIn('.test-email', 'test@example.com');
    await fillIn('.test-password', 'password123');
    await click('.test-log-in');
    await visit('/admin');

    await percySnapshot('/admin/index');

    assert.equal(currentURL(), '/admin', 'Does not redirect');
  });
});


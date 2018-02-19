import { currentURL, currentRouteName, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';

module('Acceptance | scroll reset after route transition', function(hooks) {
  setupEmberObserverTest(hooks);

  test('reset scroll after transition to a route', async function(assert) {
    server.create('maintainer', 1);
    await visit('/');
    assert.equal(currentURL(), '/');
    assert.equal(window.scrollY, 0);
    // move scroll down
    window.scrollTo(40, 80);
    await visit('/maintainers/maintainer-0');
    assert.equal(window.scrollY, 0);
    assert.equal(currentRouteName(), 'maintainers.show');
  });
});

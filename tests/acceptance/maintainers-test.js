import { currentRouteName, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';

module('Acceptance: Maintainers', function(hooks) {
  setupEmberObserverTest(hooks);

  test('can view page for a valid maintainer', async function(assert) {
    server.create('maintainer', 1);

    await visit('/maintainers/maintainer-0');

    assert.equal(currentRouteName(), 'maintainers.show');
  });

  test('trying to view a nonexistent maintainer redirects to not-found page', async function(assert) {
    await visit('/maintainers/404maintainernotfound');

    assert.equal(currentRouteName(), 'model-not-found');
  });
});

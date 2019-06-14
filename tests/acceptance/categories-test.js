import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';


module('Acceptance | categories', function(hooks) {
  setupEmberObserverTest(hooks);

  test('trying to view a nonexistent category displays not-found content', async function(assert) {
    await visit('/categories/addons-that-violate-fundamental-laws-of-the-universe');

    assert.equal(currentURL(), '/categories/addons-that-violate-fundamental-laws-of-the-universe', 'preserves URL');
    assert.dom('.test-not-found').hasText("Oops! We can't find what you were looking for. Try searching above?");
  });
});

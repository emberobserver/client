import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | categories', function(hooks) {
  setupApplicationTest(hooks);

  test('trying to view a nonexistent category displays not-found content', async function(assert) {
    await visit('/categories/addons-that-violate-fundamental-laws-of-the-universe');

    assert.equal(currentURL(), '/categories/addons-that-violate-fundamental-laws-of-the-universe', 'preserves URL');
    assert.dom('.test-not-found').hasText("Oops! We can't find what you were looking for. Try searching above?");
  });
});

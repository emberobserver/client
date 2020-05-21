import { module, test } from 'qunit';
import { click, currentURL, findAll, visit } from '@ember/test-helpers';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';

module('Acceptance | categories', function(hooks) {
  setupEmberObserverTest(hooks);

  test('trying to view a nonexistent category displays not-found content', async function(assert) {
    await visit('/categories/addons-that-violate-fundamental-laws-of-the-universe');

    assert.equal(currentURL(), '/categories/addons-that-violate-fundamental-laws-of-the-universe', 'preserves URL');
    assert.dom('.test-not-found').hasText("Oops! We can't find what you were looking for. Try searching above?");
  });

  test('can change category sorting', async function(assert) {
    server.logging = true;
    let category = server.create('category', { name: 'Awesome addons' });
    server.create('addon', {
      categories: [category],
      name: 'Omega',
      score: 10,
    });
    server.create('addon', {
      categories: [category],
      name: 'Alpha',
      score: 5,
    });
    await visit('/categories/awesome-addons');

    // addons are initially sorted by score
    assert.dom(findAll('.test-addon-name .addon-name')[0]).hasText('Omega');
    assert.dom(findAll('.test-addon-name .addon-name')[1]).hasText('Alpha');

    // change to sort by name
    await click('[data-test-sort-by="name"]');

    // addons are now sorted by name
    assert.dom(findAll('.test-addon-name .addon-name')[0]).hasText('Alpha');
    assert.dom(findAll('.test-addon-name .addon-name')[1]).hasText('Omega');
  });
});

import { click, fillIn, currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';
import { selectChoose } from 'ember-power-select/test-support/helpers';
import visitAddon from '../helpers/visit-addon';
import findByText from '../helpers/find-by-text';

module('Acceptance | header search', function(hooks) {
  setupEmberObserverTest(hooks);

  test('Header search returns addons to select', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon'
    });

    server.create('addon', { name: 'addon-test' });

    await visitAddon(addon);

    await fillIn('.test-header-search input', 'test');

    assert.typeaheadSuggestionsAre('.test-header-search-dropdown', ['test-addon', 'Perform full search »', 'addon-test'], 'Search displays matching addons and option to perform a search');
  });

  test('Header search has option to full search', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon'
    });

    await visitAddon(addon);

    await fillIn('.test-header-search input', 'test');

    await selectChoose('.test-header-search', 'Perform full search');

    assert.equal(currentURL(), '/?query=test', 'Perform full search takes to index with correct query');
  });

  test('Selecting addon result navigates to that addon', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon'
    });

    server.create('addon', { name: 'addon-test' });

    await visitAddon(addon);

    await fillIn('.test-header-search input', 'test');

    await selectChoose('.test-header-search', 'test-addon');

    assert.equal(currentURL(), '/addons/test-addon', 'Selecting an addon navigates to that addon');
  });

  test('Perform full search is still an option when no matching results', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon'
    });

    await visitAddon(addon);

    await fillIn('.test-header-search input', 'foo');

    assert.typeaheadSuggestionsAre('.test-header-search-dropdown', ['No matching addons (by name). Try a full search »'], 'Perform full search is only option when no matches');
  });

  test('Max five addon results display', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon'
    });

    server.create('addon', { name: 'test-foo' });
    server.create('addon', { name: 'test-blah' });
    server.create('addon', { name: 'test-damn' });
    server.create('addon', { name: 'test-things' });
    server.create('addon', { name: 'test-others' });

    await visitAddon(addon);

    await fillIn('.test-header-search input', 'test');

    let expectedResults = [
      'test-addon',
      'Perform full search »',
      'test-blah',
      'test-damn',
      'test-foo',
      'test-others'
    ];

    assert.typeaheadSuggestionsAre('.test-header-search-dropdown', expectedResults, 'Shows max of five matching addons');
  });

  test('Each option is also a link to where it would go', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon'
    });

    server.create('addon', { name: 'addon-test' });

    await visitAddon(addon);

    await fillIn('.test-header-search input', 'test');

    await click(findByText('.test-search-result-addon-link', 'addon-test'));

    assert.equal(currentURL(), '/addons/addon-test', 'Link goes to the selected addon');

    await fillIn('.test-header-search input', 'foo');

    await click('.test-search-result-jump-to-full-search-link');

    assert.equal(currentURL(), '/?query=foo', 'Link goes to main search with query');
  });

  test('Addon results sort by match, then score, then name', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon'
    });

    server.create('addon', { name: 'power-select-xyz', score: 4 });
    server.create('addon', { name: 'power-select-foo', score: 4 });
    server.create('addon', { name: 'ember-power-select', score: 10 });
    server.create('addon', { name: 'ember-cli-power-select', score: 8 });

    await visitAddon(addon);

    await fillIn('.test-header-search input', 'pow');

    let expectedResults = [
      'ember-power-select',
      'Perform full search »',
      'ember-cli-power-select',
      'power-select-foo',
      'power-select-xyz'
    ];

    assert.typeaheadSuggestionsAre('.test-header-search-dropdown', expectedResults, 'Results are sorted by match, then score, then name, ignoring "ember-" and "ember-cli-" prefixes');
  });
});

import { test } from 'qunit';
import moduleForAcceptance from 'ember-addon-review/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | header search');

test('Header search returns addons to select', function(assert) {
  let addon = server.create('addon', {
    name: 'test-addon'
  });

  server.create('addon', { name: 'addon-test' });

  visit(`/addons/${addon.name}`);

  fillIn('.test-header-search input', 'test');

  andThen(function() {
    assert.typeaheadSuggestionsAre('.test-header-search-dropdown', ['test-addon', 'Perform full search »', 'addon-test'], 'Search displays matching addons and option to perform a search');
  });
});

test('Header search has option to full search', function(assert) {
  let addon = server.create('addon', {
    name: 'test-addon'
  });

  visit(`/addons/${addon.name}`);

  fillIn('.test-header-search input', 'test');

  selectChoose('.test-header-search', 'Perform full search');

  andThen(function() {
    assert.equal(currentURL(), '/?query=test', 'Perform full search takes to index with correct query');
  });
});

test('Selecting addon result navigates to that addon', function(assert) {
  let addon = server.create('addon', {
    name: 'test-addon'
  });

  server.create('addon', { name: 'addon-test' });

  visit(`/addons/${addon.name}`);

  fillIn('.test-header-search input', 'test');

  selectChoose('.test-header-search', 'test-addon');

  andThen(function() {
    assert.equal(currentURL(), '/addons/test-addon', 'Selecting an addon navigates to that addon');
  });
});

test('Perform full search is still an option when no matching results', function(assert) {
  let addon = server.create('addon', {
    name: 'test-addon'
  });

  visit(`/addons/${addon.name}`);

  fillIn('.test-header-search input', 'foo');

  andThen(function() {
    assert.typeaheadSuggestionsAre('.test-header-search-dropdown', ['No matching addons (by name). Try a full search »'], 'Perform full search is only option when no matches');
  });
});

test('Max five addon results display', function(assert) {
  let addon = server.create('addon', {
    name: 'test-addon'
  });

  server.create('addon', { name: 'test-foo' });
  server.create('addon', { name: 'test-blah' });
  server.create('addon', { name: 'test-damn' });
  server.create('addon', { name: 'test-things' });
  server.create('addon', { name: 'test-others' });

  visit(`/addons/${addon.name}`);

  fillIn('.test-header-search input', 'test');

  let expectedResults = [
    'test-addon',
    'Perform full search »',
    'test-blah',
    'test-damn',
    'test-foo',
    'test-others'
  ];

  andThen(function() {
    assert.typeaheadSuggestionsAre('.test-header-search-dropdown', expectedResults, 'Shows max of five matching addons');
  });
});

test('Each option is also a link to where it would go', function(assert) {
  let addon = server.create('addon', {
    name: 'test-addon'
  });

  server.create('addon', { name: 'addon-test' });

  visit(`/addons/${addon.name}`);

  fillIn('.test-header-search input', 'test');

  click('.test-search-result-addon-link:contains(addon-test)');

  andThen(function() {
    assert.equal(currentURL(), '/addons/addon-test', 'Link goes to the selected addon');
  });

  fillIn('.test-header-search input', 'foo');

  click('.test-search-result-jump-to-full-search-link');

  andThen(function() {
    assert.equal(currentURL(), '/?query=foo', 'Link goes to main search with query');
  });
});

test('Addon results sort by match, then score, then name', function(assert) {
  let addon = server.create('addon', {
    name: 'test-addon'
  });

  server.create('addon', { name: 'power-select-xyz', score: 4 });
  server.create('addon', { name: 'power-select-foo', score: 4 });
  server.create('addon', { name: 'ember-power-select', score: 10 });
  server.create('addon', { name: 'ember-cli-power-select', score: 8 });

  visit(`/addons/${addon.name}`);

  fillIn('.test-header-search input', 'pow');

  let expectedResults = [
    'ember-power-select',
    'Perform full search »',
    'ember-cli-power-select',
    'power-select-foo',
    'power-select-xyz'
  ];

  andThen(function() {
    assert.typeaheadSuggestionsAre('.test-header-search-dropdown', expectedResults, 'Results are sorted by match, then score, then name, ignoring "ember-" and "ember-cli-" prefixes');
  });
});

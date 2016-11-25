import { test } from 'qunit';
import moduleForAcceptance from 'ember-addon-review/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | code search');

test('searching for addons containing code', function(assert) {
  let firstAddon = server.create('addon', { name: 'ember-try' });
  server.create('addon', { name: 'ember-blanket' });
  server.create('addon', { name: 'ember-foo' });

  let query;

  server.get('/search/addons', (db, request) => {
    query = request.queryParams.query;
    return {
      results: [
        {
          addon: 'ember-try',
          count: 1
        },
        {
          addon: 'ember-blanket',
          count: 3
        },
        {
          addon: 'ember-foo',
          count: 2
        }
      ]
    };
  });

  visit('/search');
  fillIn('#code-search-input', 'TestEm.afterTests');

  andThen(function() {
    assert.equal(query, 'TestEm.afterTests', 'query is passed to request');
    assert.equal(find('.test-addon-name').length, 3, 'All addons in results show');

    assert.equal(find(`[data-id="${firstAddon.id}"] .test-addon-name`).text().trim(), 'ember-try', 'Addon name shows');
    assert.equal(find(`[data-id="${firstAddon.id}"] .test-addon-name`).attr('href'), '/addons/ember-try', 'Addon name links to addon page');
    assert.equal(find(`[data-id="${firstAddon.id}"] .test-usage-count`).text().trim(), '1 usage', 'Addon usage count shows');
  });

  click('.test-clear-search');

  andThen(() => {
    assert.notExists('.test-addon-name', 'Results are cleared');
  });
});

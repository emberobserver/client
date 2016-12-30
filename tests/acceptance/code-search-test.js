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
  click('.test-submit-search');

  andThen(function() {
    assert.equal(query, 'TestEm.afterTests', 'query is passed to request');
    assert.equal(find('.test-addon-name').length, 3, 'All addons in results show');

    assert.contains(`[data-id="${firstAddon.id}"] .test-addon-name`, 'ember-try', 'Addon name shows');
    assert.equal(find(`[data-id="${firstAddon.id}"] .test-addon-name`).attr('href'), '/addons/ember-try', 'Addon name links to addon page');
    assert.equal(find(`[data-id="${firstAddon.id}"] .test-usage-count`).text().trim(), '1 usage', 'Addon usage count shows');
    assert.contains('.test-result-info', '6 usages');
  });

  click('.test-clear-search');

  andThen(() => {
    assert.notExists('.test-addon-name', 'Results are cleared');
  });
});

test('viewing addon source containing search query', function(assert) {
  server.create('addon', { name: 'ember-try' });

  let addonParam, queryParam;
  server.get('/search/addons', () => {
    return {
      results: [
        {
          addon: 'ember-try',
          count: 2
        }
      ]
    };
  });

  server.get('/search/source', (db, request) => {
    addonParam = request.queryParams.addon;
    queryParam = request.queryParams.query;
    return {
      results: [
        {
          line_number: 52,
          filename: 'app/services/fake-service.js',
          lines: [
            { text: "if (addonData) {", number: 51 },
            { text: "addons.pushObject({ addon: addonData.addon });", number: 52 },
            { text: "}", number: 53 }
          ]
        },
        {
          line_number: 21,
          filename: 'app/components/fake-thing.js',
          lines: [
            { number: 20, text: '' },
            { number: 21, text: 'store: inject.service(),' },
            { number: 22, text: '' }
          ]
        }
      ]
    };
  });

  visit('/search');
  fillIn('#code-search-input', 'asdf');
  click('.test-submit-search');
  click('.test-usage-count');

  andThen(function() {
    assert.equal('ember-try', addonParam, 'Addon name is provided to request');
    assert.equal('asdf', queryParam, 'Query is provided to request');

    assert.exists('.test-usage:contains("app/services/fake-service.js:52")', 'Filename shows with line number of match');
    assert.exists('.test-usage:contains("51if (addonData) {")', 'Source code lines show with line numbers');
    assert.equal(find('.match').length, 2, 'Two matches are highlighted');

    assert.exists('.test-usage .match:contains("addons.pushObject({ addon: addonData.addon });")', 'First match is highlighted correctly');
    assert.exists('.test-usage .match:contains("store: inject.service(),")', 'Second match is highlighted correctly');

    assert.exists('.test-usage:contains("app/components/fake-thing.js:21")', 'Shows both usages');
  });

  click('.test-usage-count');

  andThen(() => {
    assert.notExists('.test-usage', 'Usage details are hidden');
  });
});

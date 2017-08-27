import { test } from 'qunit';
import moduleForAcceptance from 'ember-observer/tests/helpers/module-for-acceptance';

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

  visit('/code-search');
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
      /* eslint-disable camelcase */
      results: [
        {
          line_number: 52,
          filename: 'app/services/fake-service.js',
          lines: [
            { text: 'if (addonData) {', number: 51 },
            { text: 'addons.pushObject({ addon: addonData.addon });', number: 52 },
            { text: '}', number: 53 }
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
      /* eslint-disable camelcase */
    };
  });

  visit('/code-search');
  fillIn('#code-search-input', 'asdf');
  click('.test-submit-search');
  click('.test-usage-count');

  andThen(function() {
    assert.equal('ember-try', addonParam, 'Addon name is provided to request');
    assert.equal('asdf', queryParam, 'Query is provided to request');

    assert.equal(find('.test-last-search').text(), 'Results for "asdf"', 'Last search shows');

    assert.exists('.test-usage:contains("app/services/fake-service.js:52")', 'Filename shows with line number of match');
    assert.exists('.test-usage:contains("51if (addonData) {")', 'Source code lines show with line numbers');
    assert.equal(find('.match').length, 2, 'Two matches are highlighted');

    assert.exists('.test-usage .match:contains("addons.pushObject({ addon: addonData.addon });")', 'First match is highlighted correctly');
    assert.exists('.test-usage .match:contains("store: inject.service(),")', 'Second match is highlighted correctly');

    assert.exists('.test-usage:contains("app/components/fake-thing.js:21")', 'Shows both usages');

    assert.equal(
      find('.test-usage:contains("fake-service") a').attr('href'),
      'https://github.com/kategengler/ember-feature-flags/tree/master/app/services/fake-service.js#L52',
      'Link to the matched source code line');
  });

  click('.test-usage-count');

  andThen(() => {
    assert.notExists('.test-usage', 'Usage details are hidden');
  });
});

test('sorting search results', function(assert) {
  server.create('addon', { name: 'ember-try' });
  server.create('addon', { name: 'ember-blanket' });
  server.create('addon', { name: 'ember-foo' });

  server.get('/search/addons', () => {
    return {
      results: [
        {
          addon: 'ember-try',
          count: 1
        },
        {
          addon: 'ember-blanket',
          count: 2
        },
        {
          addon: 'ember-foo',
          count: 3
        }
      ]
    };
  });

  visit('/code-search');
  fillIn('#code-search-input', 'foo');
  click('.test-submit-search');

  andThen(function() {
    assert.contains('.test-addon-name:eq(0)', 'ember-blanket', 'Default sort is by addon name');
    assert.contains('.test-addon-name:eq(1)', 'ember-foo', 'Default sort is by addon name');
    assert.contains('.test-addon-name:eq(2)', 'ember-try', 'Default sort is by addon name');
  });

  click('.test-sort button:contains("Usages")');

  andThen(() => {
    assert.contains('.test-addon-name:eq(0)', 'ember-foo', 'Addons are sorted by usage count');
    assert.contains('.test-addon-name:eq(1)', 'ember-blanket', 'Addons are sorted by usage count');
    assert.contains('.test-addon-name:eq(2)', 'ember-try', 'Addons are sorted by usage count');
    assert.equal(currentURL(), '/code-search?codeQuery=foo&sort=usages', 'Sort is in query params');
  });
});

test('searching with a regex', function(assert) {
  server.create('addon', { name: 'ember-try' });

  let addonRegexParam, usageRegexParam;
  server.get('/search/addons', (db, request) => {
    addonRegexParam = request.queryParams.regex;
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
    usageRegexParam = request.queryParams.regex;
    return {
      /* eslint-disable camelcase */
      results: [
        {
          line_number: 52,
          filename: 'app/services/fake-service.js',
          lines: [
            { text: 'if (addonData) {', number: 51 },
            { text: 'addons.pushObject({ addon: addonData.addon });', number: 52 },
            { text: '}', number: 53 }
          ]
        }
      ]
      /* eslint-disable camelcase */
    };
  });

  visit('/code-search?codeQuery=foo&regex=true');

  andThen(function() {
    assert.equal('true', addonRegexParam, 'Regex param from queryParams is included in initial addon request and is true');
    assert.exists('.test-regex-search:checked', 'Regex checkbox is checked');
    assert.equal(find('.test-last-search').text(), 'Results for /foo/', 'Last search shows as a regex');
    assert.equal(find('.test-regex-help').attr('href'), 'https://github.com/google/re2/wiki/Syntax', 'Regex syntax link shows');
  });

  click('.test-usage-count');
  andThen(() => {
    assert.equal('true', usageRegexParam, 'Regex param is included in usage request and is true');
  });

  click('.test-regex-search');

  andThen(() => {
    assert.equal(find('.test-last-search').text(), 'Results for /foo/', 'Last search still shows as a regex');
  });

  click('.test-submit-search');
  andThen(() => {
    assert.equal('false', addonRegexParam, 'Regex param is included in addon request and is false');
    assert.notExists('.test-regex-help', 'Regex syntax link does not show when regex is deselected');
  });

  click('.test-usage-count');
  andThen(() => {
    assert.equal('false', usageRegexParam, 'Regex param is included in usage request and is false');
  });
});

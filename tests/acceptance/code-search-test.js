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

test('searching when sort is set in query param', function(assert) {
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

  visit('/code-search?sort=usages');
  fillIn('#code-search-input', 'foo');
  click('.test-submit-search');

  andThen(function() {
    assert.contains('.test-addon-name:eq(0)', 'ember-foo', 'Addons are sorted by usages');
    assert.contains('.test-addon-name:eq(1)', 'ember-blanket', 'Addons are sorted by usages');
    assert.contains('.test-addon-name:eq(2)', 'ember-try', 'Addons are sorted by usages');
  });
});

test('viewing more results', function(assert) {
  let addons = server.createList('addon', 4);

  server.get('/search/addons', () => {
    return {
      results: searchResults(addons)
    };
  });

  visit('/code-search');
  fillIn('#code-search-input', 'TestEm.afterTests');
  click('.test-submit-search');

  andThen(function() {
    assert.equal(3, find('.test-addon-name').length, 'First 50 results show');
    assert.equal(1, find('.test-view-more').length, 'View more link shows');
  });

  click('.test-view-more');

  andThen(function() {
    assert.equal(4, find('.test-addon-name').length, 'All 51 results show');
    assert.equal(0, find('.test-view-more').length, 'View more link does not show');
  });
});

test('filtering search results by file path', function(assert) {
  server.create('addon', { name: 'ember-try' });
  server.create('addon', { name: 'ember-blanket' });
  server.create('addon', { name: 'ember-foo' });

  let filterTerm = 'index';

  server.get('/search/addons', () => {
    return {
      results: [
        {
          addon: 'ember-try',
          count: 1,
          files: ['app/controllers/index.js']
        },
        {
          addon: 'ember-blanket',
          count: 2,
          files: ['app/components/blanket.js', 'app/templates/components/blanket.hbs']
        },
        {
          addon: 'ember-foo',
          count: 3,
          files: ['app/controllers/index.js', 'app/controllers/index.js', 'app/services/current-foo.js']
        }
      ]
    };
  });

  visit('/code-search');
  fillIn('#code-search-input', 'whatever');
  click('.test-submit-search');

  andThen(function() {
    assert.equal(find('.test-addon-name').length, 3, 'shows all addons before filtering');
  });

  fillIn('.test-file-filter-input', filterTerm);

  andThen(function() {
    assert.equal(find('.test-addon-name').length, 2, 'shows only matching addons after filtering');
    assert.contains('.test-result-info', '2 addons', 'filtered result count shows when filter is applied');
    assert.contains('.test-result-info', '3 usages', 'filtered usage count shows when filter is applied');
  });

  click('.test-clear-file-filter');

  andThen(function() {
    assert.equal(find('.test-addon-name').length, 3, 'shows all addons after clearing filter');
  });

  let regexFilterTerm = 'components.*js';
  fillIn('.test-file-filter-input', regexFilterTerm);

  andThen(function() {
    assert.equal(find('.test-addon-name').length, 1, 'shows only matching addons after filtering');
    assert.contains('.test-result-info', '1 addon', 'filtered result count is correct after regex search');
    assert.contains('.test-result-info', '1 usage', 'filtered usage count is correct after regex search');
  });
});

test('filtering addon source by file path', function(assert) {
  server.create('addon', { name: 'no-match' });
  let addonWithFilteredFiles = server.create('addon', { name: 'has-match' });

  let filterTerm = 'index';

  server.get('/search/addons', () => {
    return {
      results: [
        {
          addon: 'no-match',
          count: 2,
          files: ['app/components/no-match.js', 'app/templates/components/no-match.hbs']
        },
        {
          addon: 'has-match',
          count: 2,
          files: ['app/controllers/index.js', 'app/services/no-match.js']
        }
      ]
    };
  });

  server.get('/search/source', () => {
    return {
      /* eslint-disable camelcase */
      results: [
        {
          line_number: 52,
          filename: 'app/controllers/index.js',
          lines: [
            { text: 'if (addonData) {', number: 51 }
          ]
        },
        {
          line_number: 21,
          filename: 'app/services/no-match.js',
          lines: [
            { number: 20, text: '' }
          ]
        }
      ]
      /* eslint-disable camelcase */
    };
  });

  visit('/code-search');
  fillIn('#code-search-input', 'whatever');
  click('.test-submit-search');

  fillIn('.test-file-filter-input', filterTerm);

  click(`[data-id="${addonWithFilteredFiles.id}"] .test-usage-count`);

  andThen(function() {
    assert.equal(find('.test-usage').length, 1, 'filtered down to 1 usage');
    assert.notExists('.test-usage:contains("app/services/no-match.js")', 'filtered out file does not show');
    assert.exists('.test-usage:contains("app/controllers/index.js")', 'file with matching name shows');
  });

  click('.test-clear-file-filter');
  click(`[data-id="${addonWithFilteredFiles.id}"] .test-usage-count`);

  andThen(function() {
    assert.equal(find('.test-usage').length, 2, 'all usages show');
    assert.exists('.test-usage:contains("app/services/no-match.js")', 'previously filtered out file now shows');
  });
});

test('filtering works with sorting and pagination', function(assert) {
  server.create('addon', { name: 'ember-try' });
  server.create('addon', { name: 'ember-blanket' });
  server.create('addon', { name: 'ember-foo' });
  server.create('addon', { name: 'ember-cli-thing' });
  server.create('addon', { name: 'ember-cli-other-thing' });
  server.create('addon', { name: 'ember-cli-matches' });

  let filterTerm = 'index';

  server.get('/search/addons', () => {
    return {
      results: [
        {
          addon: 'ember-try',
          count: 1,
          files: ['app/controllers/index.js']
        },
        {
          addon: 'ember-blanket',
          count: 5,
          files: ['app/components/blanket.js',
            'app/templates/components/blanket.hbs',
            'app/templates/blanket.hbs',
            'blah.js',
            'thing.js']
        },
        {
          addon: 'ember-foo',
          count: 3,
          files: ['app/controllers/index.js',
            'app/controllers/index.js',
            'app/services/current-foo.js']
        },
        {
          addon: 'ember-cli-thing',
          count: 6,
          files: ['app/controllers/index.js',
            'app/controllers/index.js',
            'app/services/current-foo.js',
            'app/templates/maybe.hbs',
            'app/templates/maybe.hbs',
            'app/templates/maybe.hbs']
        },
        {
          addon: 'ember-cli-other-thing',
          count: 1,
          files: ['app/services/current-thing.js']
        },
        {
          addon: 'ember-cli-matches',
          count: 1,
          files: ['app/controllers/index.js']
        }
      ]
    };
  });

  visit('/code-search');
  fillIn('#code-search-input', 'whatever');
  click('.test-submit-search');
  click('.test-sort button:contains("Usages")');
  fillIn('.test-file-filter-input', filterTerm);

  andThen(function() {
    assert.equal(find('.test-addon-name').length, 3, 'shows one page worth of addons after filtering');
    assert.contains('.test-result-info', '4 addons', 'filtered addon count shows when filter is applied');
    assert.contains('.test-result-info', '6 usages', 'filtered usage count shows when filter is applied');
    assert.contains('.test-addon-name:eq(0)', 'ember-cli-thing', 'addons are sorted by usage count');
  });

  click('.test-view-more');

  andThen(function() {
    assert.equal(find('.test-addon-name').length, 4, 'adds additional addons that meet filter criteria');
  });

  click('.test-sort button:contains("Name")');

  andThen(function() {
    assert.equal(find('.test-addon-name').length, 3, 'resets to first page after sorting');
    assert.contains('.test-result-info', '4 addons', 'filtered addon count still shows after sorting');
    assert.contains('.test-result-info', '6 usages', 'filtered usage count still shows after sorting');
    assert.contains('.test-addon-name:eq(0)', 'ember-cli-matches', 'addons are sorted by name');
  });

  click('.test-view-more');
  click('.test-clear-file-filter');

  andThen(function() {
    assert.equal(find('.test-addon-name').length, 3, 'shows first page of addons after clearing filter');
    assert.contains('.test-result-info', '6 addons', 'un-filtered addon count shows');
    assert.contains('.test-result-info', '17 usages', 'un-filtered usage count shows');
    assert.contains('.test-addon-name:eq(0)', 'ember-blanket', 'addons are sorted by name');
  });
});

function searchResults(addons) {
  return addons.map((addon) => {
    return {
      addon: addon.name,
      count: 1
    };
  });
}

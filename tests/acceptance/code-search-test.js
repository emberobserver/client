import { find, click, fillIn, findAll, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';

module('Acceptance | code search', function(hooks) {
  setupEmberObserverTest(hooks);

  test('searching for addons containing code', async function(assert) {
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

    await visit('/code-search');
    await fillIn('#code-search-input', 'TestEm.afterTests');
    await click('.test-submit-search');

    assert.equal(query, 'TestEm.afterTests', 'query is passed to request');
    assert.equal(findAll('.test-addon-name').length, 3, 'All addons in results show');

    assert.contains(`[data-id="${firstAddon.id}"] .test-addon-name`, 'ember-try', 'Addon name shows');
    assert.equal(find(`[data-id="${firstAddon.id}"] .test-addon-name`).getAttribute('href'), '/addons/ember-try', 'Addon name links to addon page');
    assert.equal(find(`[data-id="${firstAddon.id}"] .test-usage-count`).textContent.trim(), '1 usage', 'Addon usage count shows');
    assert.contains('.test-result-info', '6 usages', 'Total usage count shows');

    await click('.test-clear-search');

    assert.notExists('.test-addon-name', 'Results are cleared');
  });

  test('viewing addon source containing search query', async function(assert) {
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

    await visit('/code-search');
    await fillIn('#code-search-input', 'asdf');
    await click('.test-submit-search');
    await click('.test-usage-count');

    assert.equal('ember-try', addonParam, 'Addon name is provided to request');
    assert.equal('asdf', queryParam, 'Query is provided to request');

    assert.equal(find('.test-last-search').textContent, 'Results for "asdf"', 'Last search shows');

    assert.exists('.test-usage:contains("app/services/fake-service.js:52")', 'Filename shows with line number of match');
    assert.exists('.test-usage:contains("51if (addonData) {")', 'Source code lines show with line numbers');
    assert.equal(findAll('.match').length, 2, 'Two matches are highlighted');

    assert.exists('.test-usage .match:contains("addons.pushObject({ addon: addonData.addon });")', 'First match is highlighted correctly');
    assert.exists('.test-usage .match:contains("store: inject.service(),")', 'Second match is highlighted correctly');

    assert.exists('.test-usage:contains("app/components/fake-thing.js:21")', 'Shows both usages');

    assert.equal(
      find('.test-usage:contains("fake-service") a').getAttribute('href'),
      'https://github.com/kategengler/ember-feature-flags/tree/master/app/services/fake-service.js#L52',
      'Link to the matched source code line');

    await click('.test-usage-count');

    assert.notExists('.test-usage', 'Usage details are hidden');
  });

  test('sorting search results', async function(assert) {
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

    await visit('/code-search');
    await fillIn('#code-search-input', 'foo');
    await click('.test-submit-search');

    assert.contains('.test-addon-name:eq(0)', 'ember-blanket', 'Default sort is by addon name');
    assert.contains('.test-addon-name:eq(1)', 'ember-foo', 'Default sort is by addon name');
    assert.contains('.test-addon-name:eq(2)', 'ember-try', 'Default sort is by addon name');

    await click('.test-sort button:contains("Usages")');

    assert.contains('.test-addon-name:eq(0)', 'ember-foo', 'Addons are sorted by usage count');
    assert.contains('.test-addon-name:eq(1)', 'ember-blanket', 'Addons are sorted by usage count');
    assert.contains('.test-addon-name:eq(2)', 'ember-try', 'Addons are sorted by usage count');
    assert.equal(currentURL(), '/code-search?codeQuery=foo&sort=usages', 'Sort is in query params');
  });

  test('searching with a regex', async function(assert) {
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

    await visit('/code-search?codeQuery=foo&regex=true');

    assert.equal('true', addonRegexParam, 'Regex param from queryParams is included in initial addon request and is true');
    assert.exists('.test-regex-search:checked', 'Regex checkbox is checked');
    assert.equal(find('.test-last-search').textContent, 'Results for /foo/', 'Last search shows as a regex');
    assert.equal(find('.test-regex-help').getAttribute('href'), 'https://github.com/google/re2/wiki/Syntax', 'Regex syntax link shows');

    await click('.test-usage-count');
    assert.equal('true', usageRegexParam, 'Regex param is included in usage request and is true');

    await click('.test-regex-search');

    assert.equal(find('.test-last-search').textContent, 'Results for /foo/', 'Last search still shows as a regex');

    await click('.test-submit-search');
    assert.equal('false', addonRegexParam, 'Regex param is included in addon request and is false');
    assert.notExists('.test-regex-help', 'Regex syntax link does not show when regex is deselected');

    await click('.test-usage-count');
    assert.equal('false', usageRegexParam, 'Regex param is included in usage request and is false');
  });

  test('searching when sort is set in query param', async function(assert) {
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

    await visit('/code-search?sort=usages');
    await fillIn('#code-search-input', 'foo');
    await click('.test-submit-search');

    assert.contains('.test-addon-name:eq(0)', 'ember-foo', 'Addons are sorted by usages');
    assert.contains('.test-addon-name:eq(1)', 'ember-blanket', 'Addons are sorted by usages');
    assert.contains('.test-addon-name:eq(2)', 'ember-try', 'Addons are sorted by usages');
  });

  test('viewing more results', async function(assert) {
    let addons = server.createList('addon', 4);

    server.get('/search/addons', () => {
      return {
        results: searchResults(addons)
      };
    });

    await visit('/code-search');
    await fillIn('#code-search-input', 'TestEm.afterTests');
    await click('.test-submit-search');

    assert.equal(3, findAll('.test-addon-name').length, 'First 3 results show');
    assert.equal(1, findAll('.test-view-more').length, 'View more link shows');

    await click('.test-view-more');

    assert.equal(4, findAll('.test-addon-name').length, 'All 4 results show');
    assert.equal(0, findAll('.test-view-more').length, 'View more link does not show');
  });

  test('filtering search results by file path', async function(assert) {
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

    await visit('/code-search');
    await fillIn('#code-search-input', 'whatever');
    await click('.test-submit-search');

    assert.equal(findAll('.test-addon-name').length, 3, 'shows all addons before filtering');

    await fillIn('.test-file-filter-input', filterTerm);

    assert.equal(findAll('.test-addon-name').length, 2, 'shows only matching addons after filtering');
    assert.contains('.test-result-info', '3 addons', 'full result count shows when filter is applied');
    assert.contains('.test-result-info', '6 usages', 'full usage count shows when filter is applied');
    assert.contains('.test-filtered-result-info', '2 addons', 'filtered result count shows when filter is applied');
    assert.contains('.test-filtered-result-info', '3 usages', 'filtered usage count shows when filter is applied');

    await click('.test-clear-file-filter');

    assert.equal(findAll('.test-addon-name').length, 3, 'shows all addons after clearing filter');

    let regexFilterTerm = 'components.*js';
    await fillIn('.test-file-filter-input', regexFilterTerm);

    assert.equal(findAll('.test-addon-name').length, 1, 'shows only matching addons after filtering');
    assert.contains('.test-filtered-result-info', '1 addon', 'filtered result count is correct after regex search');
    assert.contains('.test-filtered-result-info', '1 usage', 'filtered usage count is correct after regex search');
  });

  test('filtering addon source by file path', async function(assert) {
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

    await visit('/code-search');
    await fillIn('#code-search-input', 'whatever');
    await click('.test-submit-search');

    await fillIn('.test-file-filter-input', filterTerm);

    await click(`[data-id="${addonWithFilteredFiles.id}"] .test-usage-count`);

    assert.equal(findAll('.test-usage').length, 1, 'filtered down to 1 usage');
    assert.notExists('.test-usage:contains("app/services/no-match.js")', 'filtered out file does not show');
    assert.exists('.test-usage:contains("app/controllers/index.js")', 'file with matching name shows');

    await click('.test-clear-file-filter');
    await click(`[data-id="${addonWithFilteredFiles.id}"] .test-usage-count`);

    assert.equal(findAll('.test-usage').length, 2, 'all usages show');
    assert.exists('.test-usage:contains("app/services/no-match.js")', 'previously filtered out file now shows');
  });

  test('filtering works with sorting and pagination', async function(assert) {
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

    await visit('/code-search');
    await fillIn('#code-search-input', 'whatever');
    await click('.test-submit-search');
    await click('.test-sort button:contains("Usages")');
    await fillIn('.test-file-filter-input', filterTerm);

    assert.equal(findAll('.test-addon-name').length, 3, 'shows one page worth of addons after filtering');
    assert.contains('.test-filtered-result-info', '4 addons', 'filtered addon count shows when filter is applied');
    assert.contains('.test-filtered-result-info', '6 usages', 'filtered usage count shows when filter is applied');
    assert.contains('.test-addon-name:eq(0)', 'ember-cli-thing', 'addons are sorted by usage count');

    await click('.test-view-more');

    assert.equal(findAll('.test-addon-name').length, 4, 'adds additional addons that meet filter criteria');

    await click('.test-sort button:contains("Name")');

    assert.equal(findAll('.test-addon-name').length, 3, 'resets to first page after sorting');
    assert.contains('.test-filtered-result-info', '4 addons', 'filtered addon count still shows after sorting');
    assert.contains('.test-filtered-result-info', '6 usages', 'filtered usage count still shows after sorting');
    assert.contains('.test-addon-name:eq(0)', 'ember-cli-matches', 'addons are sorted by name');

    await click('.test-view-more');
    await click('.test-clear-file-filter');

    assert.equal(findAll('.test-addon-name').length, 3, 'shows first page of addons after clearing filter');
    assert.notExists('.test-filtered-result-info', 'filtered result counts are gone after clearing');
    assert.exists('.test-result-info', 'total result counts are still showing');
    assert.contains('.test-addon-name:eq(0)', 'ember-blanket', 'addons are sorted by name');
  });

  test('when file filter regex is invalid', async function(assert) {
    server.create('addon', { name: 'ember-try' });
    server.create('addon', { name: 'ember-blanket' });
    server.create('addon', { name: 'ember-foo' });

    let invalidFilter = '(index';

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

    await visit('/code-search');
    await fillIn('#code-search-input', 'whatever');
    await click('.test-submit-search');

    assert.equal(findAll('.test-addon-name').length, 3, 'shows all addons before filtering');

    await fillIn('.test-file-filter-input', invalidFilter);

    assert.equal(findAll('.test-addon-name').length, 0, 'no addons show after filtering');
    assert.contains('.test-result-info', '3 addons', 'full result count still shows');
    assert.contains('.test-result-info', '6 usages', 'full usage count still shows');
    assert.contains('.test-filtered-result-info', '0 addons', 'filtered result count is 0');
    assert.contains('.test-filtered-result-info', '0 usages', 'filtered usage count is 0');
  });

  function searchResults(addons) {
    return addons.map((addon) => {
      return {
        addon: addon.name,
        count: 1
      };
    });
  }
});

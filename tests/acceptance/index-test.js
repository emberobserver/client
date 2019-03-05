import { click, fillIn, find, findAll, currentURL, currentRouteName, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { percySnapshot } from 'ember-percy';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';
import findByText from '../helpers/find-by-text';

module('Acceptance: Index', function(hooks) {
  setupEmberObserverTest(hooks);

  test('visiting /', async function(assert) {
    server.createList('category', 7);
    let addons = server.createList('addon', 4);
    let category = server.create('category',
      {
        name: 'Authentication',
        description: 'Addons for auth',
        addonCount: 4
      });

    category.update({ addonIds: addons.mapBy('id') });

    let addonA = server.create('addon');

    let categoryA = server.create('category',
      {
        name: 'Simple Auth',
        description: 'Simple Auth addons',
        addonCount: 1,
        parentId: category.id
      });

    categoryA.update({ addonIds: [addonA.id] });

    await visit('/');

    await percySnapshot('/index');

    assert.dom('.test-category').exists({ count: 8 }, 'All categories should display');
    assert.ok(findByText('.test-category', 'Authentication (5)'), 'Categories should list title and count of addons');
    let firstSubcategory = findAll('.test-subcategory')[0];
    assert.dom(firstSubcategory).containsText('Simple Auth (1)', 'Subcategories should display under category');

    let authenticationCategory = findByText('.test-category', 'Authentication');
    await click(authenticationCategory);

    assert.equal(currentURL(), '/categories/authentication', 'URL should use category name token');
    assert.dom('.test-category-header').hasText('Authentication', 'Header should display');
    assert.dom('.test-category-description').containsText('Addons for auth', 'Description should display');
    assert.dom('.test-addon-row').exists({ count: 4 }, 'All addons in category should display');
    assert.dom('.test-addon-table-count').hasText('Displaying 4 addons', 'Should show addon count');

    let simpleAuth = findByText('a', 'Simple Auth (1)');
    await click(simpleAuth);

    await percySnapshot('/categories/show');

    assert.equal(currentURL(), '/categories/simple-auth', 'URL should use category name token');
    assert.dom('.test-category-header').containsText('Simple Auth', 'Header should display');
    assert.dom('.test-category-description').containsText('Simple Auth addons', 'Description should display');
    assert.dom('.test-addon-row').exists('All addons in category should display');
    assert.dom('.test-parent-category-link').hasText('Authentication (5)', 'Should link to parent category');
    assert.dom('.test-addon-table-count').hasText('Displaying 1 addon', 'Should show addon count');
  });

  testSearch('/', function(assert) {
    assert.ok(findByText('h1', 'Top addons'));
  });

  test('including readme matches in search', async function(assert) {
    let addon1 = server.create('addon', { name: 'ember-test-thing' });
    let addon2 = server.create('addon', { name: 'ember-different' });

    server.get('/search', (db, request) => {
      assert.equal(request.queryParams.query, 'test', 'Query is sent to readme search');
      return {
        search: [
          { addon_id: addon1.id, matches: ['testing stuff', 'more testing tips'] },  // eslint-disable-line camelcase
          { addon_id: addon2.id, matches: ['the test of time'] }                     // eslint-disable-line camelcase
        ]
      };
    });

    await visit('/');

    await fillIn('#search-input', 'test');
    await click('.test-search-readmes');

    assert.equal(currentURL(), '/?query=test&searchReadmes=true');
    assert.dom('.test-result-info').hasText('Results for "test"');
    assert.dom('.addon-results .addon-list li').exists('Only 1 addon result');
    assert.dom('.addon-results .addon-list li').containsText('ember-test-thing');

    assert.dom('.readme-results li').exists({ count: 2 }, '2 matching readmes');
    assert.ok(findByText('.test-readme-match', 'testing stuff'));
    assert.ok(findByText('.test-readme-match', 'more testing tips'));
    assert.ok(findByText('.test-readme-match', 'the test of time'));

    assert.dom('#search-input').hasValue('test', 'Query is in text box');
    assert.equal(find('.test-search-readmes').checked, true, 'Include readmes is checked');

    await click('.test-search-readmes');

    assert.equal(currentURL(), '/?query=test');
    assert.dom('.test-result-info').hasText('Results for "test"');
    assert.dom('.addon-results .addon-list li').exists('Only 1 addon result');
    assert.dom('.addon-results .addon-list li').containsText('ember-test-thing');

    assert.dom('.readme-results li').doesNotExist('No readme results count showing');
    assert.dom('.readme-list li').doesNotExist('No readme matches showing');

    assert.dom('#search-input').hasValue('test', 'Query is still in text box');
    assert.equal(find('.test-search-readmes').checked, false, 'Include readmes is not checked');
  });

  test('readme matches are sanitized', async function(assert) {
    let addon = server.create('addon', { name: 'ember-different' });

    server.get('/search', () => {
      return {
        search: [
          { addon_id: addon.id, matches: ['<style> a { color: "green"; }</style>'] }  // eslint-disable-line camelcase
        ]
      };
    });

    await visit('/');

    await fillIn('#search-input', 'test');
    await click('.test-search-readmes');

    assert.dom('.test-readme-match style').doesNotExist('<style> tag is stripped');
  });

  test('going to a maintainer from search results works', async function(assert) {
    server.create('maintainer', { name: 'test-master' });

    await visit('/?query=test');

    let maintainer = findByText('.maintainer-results a', 'test-master');
    await click(maintainer);

    assert.ok(findByText('h1', 'test-master'));
  });

  test('going to an addon from search results works', async function(assert) {
    server.create('addon', { name: 'ember-test', license: 'GPL' });

    await visit('/?query=test');

    let addon = findByText('.addon-list a', 'ember-test');
    await click(addon);

    assert.ok(findByText('h1', 'ember-test'));
    assert.dom('.test-addon-license').containsText('GPL');
  });

  test('going to a category from search results works', async function(assert) {
    server.create('category', { name: 'Testing' });

    await visit('/?query=test');

    let result = findByText('.category-results a', 'Testing');
    await click(result);

    assert.ok(findByText('h1', 'Testing'));
  });

  test('Unknown routes are handled', async function(assert) {
    await visit('/bullshit');

    await percySnapshot('not-found');

    assert.equal(currentRouteName(), 'not-found');
  });

  test('provides a link to the top addons', async function(assert) {
    server.create('addon', { name: 'ember-a-thing' });
    server.create('addon', { name: 'ember-test-me', description: 'A thin addon' });

    await visit(`/?query=test`);

    await click(findByText('.top-addons a', 'See all top 100 addons'));

    await percySnapshot('/lists/top-addons');

    assert.equal(currentURL(), '/lists/top-addons', 'link to top addons works');
  });

  function testSearch(url, assertForContentOnUrl) {
    test(`visiting ${url} with a query`, async function(assert) {
      server.create('addon', { name: 'ember-a-thing' });
      server.create('addon', { name: 'ember-test-me', description: 'A thin addon' });
      server.create('category', { name: 'Another thing' });
      server.create('category', { name: 'quietest' });
      server.create('category', { name: 'Testing' });
      server.create('maintainer', { name: 'test-master' });

      await visit(`${url}?query=test`);

      assert.equal(currentURL(), `${url}?query=test`);
      assert.dom('.test-result-info').hasText('Results for "test"');
      assert.dom('.addon-results .addon-list li').exists({ count: 1 }, 'Only 1 addon result');
      assert.dom('.addon-results .addon-list li').containsText('ember-test-me');
      assert.dom('.category-results li').exists({ count: 2 }, '2 matching categories');
      assert.dom('.maintainer-results li').exists('1 matching maintainer');
      assert.dom('#search-input').hasValue('test', 'Query is in text box');

      await fillIn('#search-input', 'thin ');

      assert.equal(currentURL(), `${url}?query=thin`);
      assert.dom('.test-result-info').hasText('Results for "thin"');
      assert.dom('.addon-results .addon-list li').exists({ count: 2 }, '2 addon results');
      let results = findAll('.addon-results .addon-list li');
      assert.dom(results[1]).containsText('ember-test-me');
      assert.dom(results[0]).containsText('ember-a-thing');
      assert.dom('.category-results li').exists('1 matching category');
      assert.dom('.maintainer-results').doesNotExist('No matching maintainers');
      assert.dom('#search-input').hasValue('thin', 'Query is in text box');

      await click('.test-clear-search');

      assert.dom('#search-input').hasValue('', 'Query is now empty');
      assert.equal(currentURL(), url);
      assertForContentOnUrl(assert);
    });
  }
});

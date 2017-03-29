import { test } from 'qunit';
import moduleForAcceptance from 'ember-observer/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance: Index');

test('visiting /', function(assert) {
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

  visit('/');

  andThen(function() {
    assert.exists('.test-category', 8, 'All categories should display');
    assert.contains('.test-category', 'Authentication (5)', 'Categories should list title and count of addons');
    assert.contains('.test-subcategory:eq(0)', 'Simple Auth (1)', 'Subcategories should display under category');
  });

  click('.test-category:contains(Authentication)');

  andThen(function() {
    assert.equal(currentURL(), '/categories/authentication', 'URL should use category name token');
    assert.contains('.test-category-header', 'Authentication', 'Header should display');
    assert.contains('.test-category-description', 'Addons for auth', 'Description should display');
    assert.exists('.test-addon-row', 4, 'All addons in category should display');
    assert.contains('.test-addon-table-count', 'Displaying 4 addons', 'Should show addon count');
  });

  click("a:contains('Simple Auth (1)')");

  andThen(function() {
    assert.equal(currentURL(), '/categories/simple-auth', 'URL should use category name token');
    assert.contains('.test-category-header', 'Simple Auth', 'Header should display');
    assert.contains('.test-category-description', 'Simple Auth addons', 'Description should display');
    assert.exists('.test-addon-row', 1, 'All addons in category should display');
    assert.contains('.test-parent-category-link', 'Authentication (5)', 'Should link to parent category');
    assert.contains('.test-addon-table-count', 'Displaying 1 addon', 'Should show addon count');
  });
});

testSearch('/', function(assert) {
  assert.exists('h1:contains(Top addons)');
});

test('including readme matches in search', function(assert) {
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

  visit('/');

  fillIn('#search-input', 'test');
  click('.test-search-readmes');

  andThen(function() {
    assert.equal(currentURL(), '/?query=test&searchReadmes=true');
    assert.contains('.test-result-info', 'Results for "test"');
    assert.exists('.addon-results .addon-list li', 1, 'Only 1 addon result');
    assert.contains('.addon-results .addon-list li', 'ember-test-thing');

    assert.exists('.readme-results li', 2, '2 matching readmes');
    assert.exists(".test-readme-match:contains('testing stuff')");
    assert.exists(".test-readme-match:contains('more testing tips')");
    assert.exists(".test-readme-match:contains('the test of time')");

    assert.equal(find('#search-input').val(), 'test', 'Query is in text box');
    assert.exists('.test-search-readmes:checked', 'Include readmes is checked');
  });

  click('.test-search-readmes');

  andThen(() => {
    assert.equal(currentURL(), '/?query=test');
    assert.contains('.test-result-info', 'Results for "test"');
    assert.exists('.addon-results .addon-list li', 1, 'Only 1 addon result');
    assert.contains('.addon-results .addon-list li', 'ember-test-thing');

    assert.notExists('.readme-results li', 'No readme results count showing');
    assert.notExists('.readme-list li', 'No readme matches showing');

    assert.equal(find('#search-input').val(), 'test', 'Query is still in text box');
    assert.exists('.test-search-readmes:not(:checked)', 'Include readmes is not checked');
  });
});

test('going to a maintainer from search results works', function(assert) {
  server.create('maintainer', { name: 'test-master' });

  visit('/?query=test');
  click('.maintainer-results a:contains(test-master)');

  andThen(function() {
    assert.visible('h1:contains(test-master)');
  });
});

test('going to an addon from search results works', function(assert) {
  server.create('addon', { name: 'ember-test', license: 'GPL' });

  visit('/?query=test');
  click('.addon-list a:contains(ember-test)');

  andThen(function() {
    assert.visible('h1:contains(ember-test)');
    assert.contains('.test-addon-license', 'GPL');
  });
});

test('going to a category from search results works', function(assert) {
  server.create('category', { name: 'Testing' });

  visit('/?query=test');
  click('.category-results a:contains(Testing)');

  andThen(function() {
    assert.visible('h1:contains(Testing)');
  });
});

test('Unknown routes are handled', function(assert) {
  visit('/bullshit');

  andThen(function() {
    assert.equal(currentPath(), 'not-found');
  });
});

function testSearch(url, assertForContentOnUrl) {
  test(`visiting ${url} with a query`, function(assert) {
    server.create('addon', { name: 'ember-a-thing' });
    server.create('addon', { name: 'ember-test-me', description: 'A thin addon' });
    server.create('category', { name: 'Another thing' });
    server.create('category', { name: 'quietest' });
    server.create('category', { name: 'Testing' });
    server.create('maintainer', { name: 'test-master' });

    visit(`${url}?query=test`);

    andThen(function() {
      assert.equal(currentURL(), `${url}?query=test`);
      assert.contains('.test-result-info', 'Results for "test"');
      assert.exists('.addon-results .addon-list li', 1, 'Only 1 addon result');
      assert.contains('.addon-results .addon-list li', 'ember-test-me');
      assert.exists('.category-results li', 2, '2 matching categories');
      assert.exists('.maintainer-results li', 1, '1 matching maintainer');
      assert.equal(find('#search-input').val(), 'test', 'Query is in text box');
    });

    fillIn('#search-input', 'thin ');

    andThen(function() {
      assert.equal(currentURL(), `${url}?query=thin`);
      assert.contains('.test-result-info', 'Results for "thin"');
      assert.exists('.addon-results .addon-list li', 2, '2 addon results');
      assert.contains('.addon-results .addon-list li', 'ember-test-me');
      assert.contains('.addon-results .addon-list li', 'ember-a-thing');
      assert.exists('.category-results li', 1, '1 matching category');
      assert.notExists('.maintainer-results', 'No matching maintainers');
      assert.equal(find('#search-input').val(), 'thin', 'Query is in text box');
    });

    click('.test-clear-search');

    andThen(function() {
      assert.equal(find('#search-input').val(), '', 'Query is now empty');
      assert.equal(currentURL(), url);
      assertForContentOnUrl(assert);
    });
  });
}

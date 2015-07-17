import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import stopApp from '../helpers/stop-app';

var application;

module('Acceptance: Index', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    stopApp(application);
  }
});

test('visiting /', function(assert) {
  var categories = server.createList('category', 7);
  var addons = server.createList('addon', 4);
  var category = server.create('category',
    {
      name: 'Authentication',
      addon_ids: addons.mapBy('id'),
      description: 'Addons for auth'
    });

  var subcategory = server.create('category',
    {
      name: 'Simple Auth',
      addon_ids: [addons[0].id],
      description: 'Simple Auth addons',
      parent_id: category.id
    });

  var subcategory2 = server.create('category',
    {
      name: 'Other Auth',
      addon_ids: [addons[1].id],
      description: 'Other Auth addons',
      parent_id: category.id
    });

  visit('/');

  andThen(function() {
    assert.inDOM('.test-category', 8, 'All categories should display');
    assert.contains('.test-category', 'Authentication (6)', 'Categories should list title and count of addons');
    assert.contains('.test-subcategories', 'Simple Auth (1)', 'Subcategories should display under category');
    assert.contains('.test-subcategories', 'Other Auth (1)', 'Subcategories should display under category');
  });

  click('.test-category:contains(Authentication)');

  andThen(function() {
    assert.equal(currentURL(), '/categories/authentication', 'URL should use category name token');
    assert.contains('.test-category-header', 'Authentication', 'Header should display');
    assert.contains('.test-category-description', 'Addons for auth', 'Description should display');
    assert.inDOM('.test-addon-row', 4, 'All addons in category should display');
    assert.contains('.test-addon-table-count', 'Displaying 4 addons', 'Should show addon count');
  });

  click("a:contains('Simple Auth (1)')");

  andThen(function() {
    assert.equal(currentURL(), '/categories/simple-auth', 'URL should use category name token');
    assert.contains('.test-category-header', 'Simple Auth', 'Header should display');
    assert.contains('.test-category-description', 'Simple Auth addons', 'Description should display');
    assert.inDOM('.test-addon-row', 1, 'All addons in category should display');
    assert.contains('.test-parent-category-link', 'Authentication (6)', 'Should link to parent category');
    assert.contains('.test-addon-table-count', 'Displaying 1 addon', 'Should show addon count');
  });
});

test('Unknown routes are handled', function(assert) {
  visit('/bullshit');

  andThen(function() {
    assert.equal(currentPath(), 'not-found');
  });
});

QUnit.assert.inDOM = function(selector, expectedCount, message) {
  var actualCount = find(selector).length;
  var result = (actualCount === expectedCount);
  this.push(result, actualCount, expectedCount, `${message} - ${expectedCount} of ${selector} expected`);
};

QUnit.assert.contains = function(selector, text, message) {
  var elements = find(selector);
  var result = false;
  var regex = new RegExp(escapeForRegex(text) + '($|\\W)', 'gm');
  elements.each(function() {
    if (regex.test($(this).text())) {
      result = true;
    }
  });

  if (!result) {
    message = message + ` - ${selector} containing ${text} should exist.`;
  }

  this.push(result, result, true, message);
};

function escapeForRegex (str) {
  return str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
}


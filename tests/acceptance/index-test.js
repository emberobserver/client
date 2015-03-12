import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import stopApp from '../helpers/stop-app';
import { validResponse } from '../helpers';

var application;

module('Acceptance: Index', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    stopApp(application);
  }
});

test('visiting /', function( assert ) {
  var categories = server.createList('category', 7);
  var addons = server.createList('addon', 4);
  var category = server.create('category', {name: 'Authentication', addon_ids: addons.mapBy('id'), description: "Addons for auth"});

  visit('/');

  andThen(function() {
    assert.inDOM('.test-category', 8, 'All categories should display');
    assert.contains('.test-category', 'Authentication (4)', 'Categories should list title and count of addons');
  });

  click('.test-category:contains(Authentication)');

  andThen(function(){
    assert.contains('.test-category-header', 'Authentication', 'Header should display');
    assert.contains('.test-category-description', 'Addons for auth', 'Description should display');
    assert.inDOM('.test-addon-row', 4, 'All addons in category should display');
  });

});

test('Unknown routes are handled', function( assert ) {
  visit('/bullshit');

  andThen(function() {
    assert.equal(currentPath(), 'not-found');
  });
});

QUnit.assert.inDOM = function( selector, expectedCount, message) {
  var actualCount = find(selector).length;
  var result = (actualCount === expectedCount);
  this.push(result, actualCount, expectedCount, `${message} - ${expectedCount} of ${selector} expected`);
};

QUnit.assert.contains = function( selector, text, message ) {
  var containsSelector = `${selector}:contains("${text}")`;
  var result = find(containsSelector).length >= 1;
  if(!result){
    message = message + ` - ${containsSelector} should exist.`;
  }
  this.push(result, result, true, message);
};

import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import stopApp from '../helpers/stop-app';
import { validResponse } from '../helpers';

var application, server;

module('Acceptance: Index', {
  beforeEach: function() {
    application = startApp();
    server = application.server;

    server.get('/api/categories', function( req ) {
      return validResponse({categories: categories()});
    });

    server.get('/api/addons', function( req ) {
      return validResponse({addons: addons(), maintainers: maintainers()});
    });
  },

  afterEach: function() {
    stopApp(application);
  }
});

test('visiting /', function( assert ) {

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

function categories() {
  return [
    {
      "id": 1,
      "name": "Authentication",
      "description": "Addons for auth",
      "addon_ids": [1, 2, 3, 4]
    },
    {
      "id": 2,
      "name": "Components",
      "description": "Addons that provide a component",
      "addon_ids": [1, 11]
    }, {
      "id": 3,
      "name": "Styles",
      "description": "Addons that provide styles, css frameworks, preprocessors",
      "addon_ids": [2, 10, 3]
    },
    {
      "id": 4,
      "name": "Testing",
      "description": "Addons related to testing",
      "addon_ids": [1, 9]
    },
    {
      "id": 5,
      "name": "Build tools",
      "description": "Addons related to preprocessing, broccoli plugins and dependencies of ember-cli",
      "addon_ids": [3]
    }, {
      "id": 6,
      "name": "Data",
      "description": "Addons related to ember-data or alternatives to ember-data",
      "addon_ids": [4]
    }, {
      "id": 7,
      "name": "Library wrappers",
      "description": "Addons that wrap third party libraries, jQuery plugins and the like",
      "addon_ids": [9]
    }, {
      "id": 8,
      "name": "Miscellaneous",
      "description": "The addons that don't fit into other categories",
      "addon_ids": []
    }];
}

function addons() {
  return [{
            "id": 1,
            "name": "balanced-addon-models",
            "repository_url": "https://github.com/balanced/balanced-addon-models",
            "latest_version_date": "2014-12-18T00:52:00.914Z",
            "description": "This README outlines the details of collaborating on this Ember addon.",
            "license": "MIT",
            "is_deprecated": false,
            "note": null,
            "is_official": false,
            "is_cli_dependency": false,
            "is_hidden": false,
            "maintainer_ids": [2]
          }, {
            "id": 2,
            "name": "bonnier-lib",
            "repository_url": "https://github.com/WebCloud/bonnier-lib",
            "latest_version_date": "2014-12-30T14:43:50.191Z",
            "description": "The default blueprint for ember-cli addons.",
            "license": "MIT",
            "is_deprecated": false,
            "note": null,
            "is_official": false,
            "is_cli_dependency": false,
            "is_hidden": false,
            "maintainer_ids": [3]
          }, {
            "id": 3,
            "name": "bricks-ui",
            "repository_url": "http://github.com/innobower/bricksui-cli",
            "latest_version_date": "2014-08-31T11:35:08.448Z",
            "description": "Include BricksUI into an ember-cli application.",
            "license": "MIT",
            "is_deprecated": false,
            "note": null,
            "is_official": false,
            "is_cli_dependency": false,
            "is_hidden": false,
            "maintainer_ids": [5]
          }, {
            "id": 4,
            "name": "broccoli-asset-rev",
            "repository_url": "http://github.com/rickharrison/broccoli-asset-rev",
            "latest_version_date": "2014-12-29T22:43:46.324Z",
            "description": "broccoli asset revisions (fingerprint)",
            "license": "MIT",
            "is_deprecated": false,
            "note": null,
            "is_official": false,
            "is_cli_dependency": false,
            "is_hidden": false,
            "maintainer_ids": [7]
          }, {
            "id": 5,
            "name": "broccoli-ember-inline-template-compiler",
            "repository_url": "https://github.com/rjackson/broccoli-ember-inline-template-compiler",
            "latest_version_date": "2014-10-14T19:25:39.817Z",
            "description": "Broccoli plugin to precompile inline Handlebars templates",
            "license": "MIT",
            "is_deprecated": false,
            "note": null,
            "is_official": false,
            "is_cli_dependency": false,
            "is_hidden": false,
            "maintainer_ids": [9, 10]
          }, {
            "id": 6,
            "name": "broccoli-image-size",
            "repository_url": "https://github.com/ntodd/broccoli-image-size",
            "latest_version_date": "2014-12-21T23:17:50.212Z",
            "description": "A broccoli plugin to rewrite image asset filenames to include dimensions",
            "license": "MIT",
            "is_deprecated": false,
            "note": null,
            "is_official": false,
            "is_cli_dependency": false,
            "is_hidden": false,
            "maintainer_ids": [12]
          }, {
            "id": 7,
            "name": "broccoli-jscs",
            "repository_url": "https://github.com/kellyselden/broccoli-jscs",
            "latest_version_date": "2015-02-08T00:29:00.550Z",
            "description": "Broccoli plugin for jscs",
            "license": "MIT",
            "is_deprecated": false,
            "note": null,
            "is_official": false,
            "is_cli_dependency": false,
            "is_hidden": false,
            "maintainer_ids": [14]
          }, {
            "id": 9,
            "name": "chart-components",
            "repository_url": "http://localhost:8088/package/chart-components/0.0.2",
            "latest_version_date": "2015-02-04T13:52:51.207Z",
            "description": "The default blueprint for ember-cli addons.",
            "license": "MIT",
            "is_deprecated": false,
            "note": null,
            "is_official": false,
            "is_cli_dependency": false,
            "is_hidden": false,
            "maintainer_ids": [18]
          }, {
            "id": 10,
            "name": "cordova-contact-adapter",
            "repository_url": "https://github.com/huafu/cordova-contact-adapter",
            "latest_version_date": "2015-01-23T08:17:50.983Z",
            "description": "An adapter and model for use with cordova contacts plugin",
            "license": "MIT",
            "is_deprecated": false,
            "note": null,
            "is_official": false,
            "is_cli_dependency": false,
            "is_hidden": false,
            "maintainer_ids": [20]
          }, {
            "id": 11,
            "name": "dc-tabs",
            "repository_url": "https://github.com/devon-capital/dc-tabs",
            "latest_version_date": "2015-02-05T15:44:29.707Z",
            "description": "Tab addon for ember.js",
            "license": "MIT",
            "is_deprecated": false,
            "note": null,
            "is_official": false,
            "is_cli_dependency": false,
            "is_hidden": false,
            "maintainer_ids": [21]
          }
  ];
}

function maintainers() {
  return [{
            "id": 2,
            "name": "tracy",
            "gravatar": "412412d3d6d6fc8809f9121216dd0"
          }, {
            "id": 3,
            "name": "quinn",
            "gravatar": "b01d191f4e4e4e4e47c44e3d2688"
          }, {
            "id": 5,
            "name": "hermann",
            "gravatar": "7d260ab22fc32413vdf424t434"
          }, {
            "id": 7,
            "name": "toby_daniel",
            "gravatar": "e243f472282538ae40deg3343344"
          }, {
            "id": 9,
            "name": "jimmy",
            "gravatar": "23423432544883adb7d3bb89487b"
          }, {
            "id": 10,
            "name": "lennie",
            "gravatar": "0dfd10ad198123141277a90a"
          }];
}


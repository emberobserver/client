import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'ember-addon-review/tests/helpers/start-app';

var application;

module('Acceptance: Addons', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('displays 0 for score when addon has zero score', function(assert) {
  var addon = server.create('addon', {
    name: 'test-with-zero-score',
    score: 0
  });

  visit(`/addons/${addon.name}`);

  andThen(function() {
    assert.contains('.score', 'Score 0', 'Displays 0 for score when addon has a score of zero');
  });
});

test('displays WIP for score when addon is WIP', function(assert) {
  var addon = server.create('addon', {
    name: 'test-wip',
    is_wip: true
  });

  visit(`/addons/${addon.name}`);

  andThen(function() {
    assert.contains('.score', 'WIP', 'Displays WIP for score');
  });
});

test('displays N/A for score when addon has no score', function(assert) {
  var addon = server.create('addon', {
    name: 'test-with-na-score',
    score: null
  });

  visit(`/addons/${addon.name}`);

  andThen(function() {
    assert.contains('.score', 'N/A', 'Displays N/A for score when addon has no score');
  });
});

test('displays note', function(assert) {
  var addon = server.create('addon', {
    name: 'test-addon-with-note',
    rendered_note: '<h2 class="test-rendered-note">RenderedNote</h2>'
  });

  visit(`/addons/${addon.name}`);

  andThen(function() {
    assert.exists('.test-addon-note h2.test-rendered-note', 'Rendered note is rendered');
  });
});

test('displays categories', function(assert) {
  var addon = server.create('addon', {
    name: 'test-addon-with-categories'
  });

  server.create('category', {
    name: 'A category for categories',
    addon_ids: [addon.id]
  });

  server.create('category', {
    name: 'Another category for categories',
    addon_ids: [addon.id]
  });

  visit(`/addons/${addon.name}`);

  andThen(function() {
    assert.contains('.test-category-list', 'A category for categories');
    assert.contains('.test-category-list', 'Another category for categories');
  });
});

test('displays github data', function(assert) {
  var addon = server.create('addon', {
    name: 'test-addon-with-github-data',
    open_issues: 13,
    forks: 94,
    stars: 37,
    contributors: [{}, {}],
    is_top_starred: true,
    latest_commit_date: window.moment().subtract(2, 'months').toString(),
    first_commit_date:  window.moment().subtract(1, 'years').toString()
  });

  visit(`/addons/${addon.name}`);

  andThen(function() {
    assert.contains('.test-github-data', 'TOP 10% STARRED');
    assert.containsExactly('.test-open-issues', '13 Open Issues');
    assert.containsExactly('.test-forks', '94 Forks');
    assert.containsExactly('.test-stars', '37 Starred');
    assert.containsExactly('.test-contributors', '2 Contributors');
    assert.containsExactly('.test-latest-commit time', '2 months ago');
    assert.containsExactly('.test-first-commit time', 'a year ago');
  });
});

test('displays header', function(assert) {
  var addon = server.create('addon', {
    name: 'test-addon'
  });

  visit(`/addons/${addon.name}`);

  andThen(function() {
    assert.contains('.test-addon-header', 'test-addon', 'Header displays addon name');
    assert.notExists('.test-addon-flag-deprecation', 'Deprecation flag does not display');
    assert.notExists('.test-addon-flag-new', 'New flag does not display');
    assert.notExists('.test-addon-flag-official', 'Official flag does not display');
    assert.notExists('.test-addon-flag-cli-dependency', 'CLI Dependency flag does not display');
  });

  var addonWithFlags = server.create('addon', {
    name: 'test-addon-with-flags',
    is_deprecated: true,
    is_new_addon: true,
    is_official: true,
    is_cli_dependency: true
  });

  visit(`/addons/${addonWithFlags.name}`);

  andThen(function() {
    assert.contains('.test-addon-header', 'test-addon', 'Header displays addon name');
    assert.exists('.test-addon-flag-deprecation', 'Deprecation flag displays');
    assert.exists('.test-addon-flag-new', 'New flag displays');
    assert.exists('.test-addon-flag-official', 'Official flag displays');
    assert.exists('.test-addon-flag-cli-dependency', 'CLI Dependency flag displays');
  });
});

test('displays review', function(assert) {
  var addon = server.create('addon', {
    name: 'test-addon'
  });

  visit(`/addons/${addon.name}`);

  andThen(function() {
    assert.exists('.test-no-review', 'Warning about not yet reviewed appears');
  });

  var addonWithReview = server.create('addon', {
    name: 'test-addon-with-review'
  });

  var review = server.create('review', {
    addon_id: addonWithReview.id,
    has_tests: 1,
    has_readme: 4,
    is_more_than_empty_addon: 3,
    is_open_source: 2,
    has_build: 1,
    review: 'Seems ok'
  });

  var addonVersion = server.create('version', {
    addon_id: addonWithReview.id,
    review_id: review.id,
    released: window.moment().subtract(3, 'months')
  });

  //Newer version without review
  server.create('version', {
    addon_id: addonWithReview.id,
    review_id: null,
    released: window.moment().subtract(1, 'months')
  });

  review.version_id = addonVersion.id;

  visit(`/addons/${addonWithReview.name}`);

  andThen(function() {
    assert.contains('.test-review-question:eq(0)', 'Is the source accessible?');
    assert.contains('.test-review-question:eq(0)', 'No');
    assert.contains('.test-review-question:eq(1)', 'Is it more than an empty addon?');
    assert.contains('.test-review-question:eq(1)', 'N/A');
    assert.contains('.test-review-question:eq(2)', 'Are there meaningful tests?');
    assert.contains('.test-review-question:eq(2)', 'Yes');
    assert.contains('.test-review-question:eq(3)', 'Is the README filled out?');
    assert.contains('.test-review-question:eq(3)', 'Unknown');
    assert.contains('.test-review-question:eq(4)', 'Does the addon have a build?');
    assert.contains('.test-review-question:eq(4)', 'Yes');

    assert.contains('.test-review-notes', 'Seems ok');

    assert.contains('.test-review-new-version-warning', 'New versions of this addon have been released since this review was undertaken.');
  });
});

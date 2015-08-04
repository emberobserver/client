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

test('addon not found', function(assert) {
  visit('/addons/what');
  andThen(function() {
    assert.equal(currentURL(), '/not-found');
    assert.contains('.test-not-found', "Oops! We can't find what you were looking for. Try searching above?");
  });
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

test('displays addon stats', function(assert) {
  var maintainers = server.createList('maintainer', 3);

  var addon = server.create('addon', {
    name: 'test-addon',
    maintainer_ids: maintainers.map((m) => m.id),
    latest_version_date: window.moment().subtract(3, 'months'),
    is_top_downloaded: true,
    last_month_downloads: 1564,
    demo_url: 'http://www.example.com/demo_of_addon',
    repository_url: 'http://www.example.com/addon_repo',
    license: 'MIT'
  });

  server.create('version', {
    version: '1.0.1',
    addon_id: addon.id,
    ember_cli_version: '1.13.1',
    released: window.moment().subtract(3, 'months')
  });

  server.create('version', {
    version: '1.0.0',
    addon_id: addon.id,
    ember_cli_version: '1.13.0',
    released: window.moment().subtract(4, 'months')
  });

  server.createList('keyword', 5, { addon_ids: [addon.id] });


  visit(`/addons/${addon.name}`);

  andThen(function() {
    assert.contains('.test-addon-install-command', 'ember install test-addon');
    assert.exists('.test-addon-install-command .copy-to-clipboard .icon-content-paste', 'Install command should have copy to clipboard button');

    assert.contains('.test-addon-latest-version', '1.0.1 from 3 months ago');

    assert.contains('.test-addon-top-downloaded', 'TOP 10%');
    assert.contains('.test-addon-top-downloaded', '1564 downloads in last month');

    assert.exists('.test-addon-demo-url a[href="http://www.example.com/demo_of_addon"]');
    assert.contains('.test-addon-demo-url b', 'example.com');
    assert.contains('.test-addon-demo-url', '/demo_of_addon');

    assert.exists('.test-addon-repo-url a[href="http://www.example.com/addon_repo"]');
    assert.contains('.test-addon-repo-url b', 'example.com');
    assert.contains('.test-addon-repo-url', '/addon_repo');

    assert.exists('.test-addon-package-url a[href="https://www.npmjs.com/package/test-addon"]');
    assert.contains('.test-addon-package-url b', 'npmjs.com');
    assert.contains('.test-addon-package-url', '/package/test-addon');

    assert.contains('.test-addon-license a[href="https://spdx.org/licenses/MIT"]', 'MIT');

    assert.containsExactly('.test-addon-keywords', 'keyword-0, keyword-1, keyword-2, keyword-3, keyword-4');

    assert.exists('.test-addon-maintainers a', 3, 'maintainers should display');
    assert.exists('.test-addon-maintainers a[href*="/maintainers/maintainer-0"]', 'maintainers should have link to them');
    assert.exists('.test-addon-maintainers img[src="https://secure.gravatar.com/avatar/412412d3d6d6fc8809f9121216dd0?d=identicon"]', 'maintainers should have gravatar');
    assert.exists('.test-addon-maintainers img[title="maintainer-0"][alt="maintainer-0"]', 'Title and source of gravatar are set');

    assert.contains('.test-addon-ember-cli-version', '1.13.1');

    assert.contains('.test-addon-version-count', 'versions (2)');
    assert.contains('.test-addon-versions li:eq(0)', '1.0.1');
    assert.contains('.test-addon-versions li:eq(1)', '1.0.0');

    assert.exists('.test-addon-badge img[src="http://emberobserver.com/badges/test-addon.svg"]');
    assert.exists('.test-addon-badge .copy-to-clipboard .icon-content-paste', 'Copy to clipboard for badge markdown');
    assert.exists('.test-addon-badge [data-clipboard-text="[![Ember Observer Score](http://emberobserver.com/badges/test-addon.svg)](http://emberobserver.com/addons/test-addon)"]');

    assert.contains('.test-addon-correction-link[href*="/addons/test-addon/correct"]', 'Suggest a correction');
  });
});

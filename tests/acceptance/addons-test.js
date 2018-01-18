import Ember from 'ember';
import { test } from 'qunit';
import moduleForAcceptance from 'ember-observer/tests/helpers/module-for-acceptance';
import EmberVersionsResponse from '../ember-version-response';
import moment from 'moment';

moduleForAcceptance('Acceptance: Addons');

test('addon not found', function(assert) {
  visit('/addons/what');
  andThen(function() {
    assert.equal(currentURL(), '/model-not-found');
    assert.contains('.test-not-found', "Oops! We can't find what you were looking for. Try searching above?");
  });
});

test('displays 0 for score when addon has zero score', function(assert) {
  let addon = server.create('addon', {
    name: 'test-with-zero-score',
    score: 0
  });

  visitAddon(addon);

  andThen(function() {
    assert.contains('.score', 'Score 0', 'Displays 0 for score when addon has a score of zero');
  });
});

test('Does not display category list', function(assert) {
  let addon = server.create('addon', {
    name: 'test-addon'
  });

  visitAddon(addon);

  andThen(function() {
    assert.notExists('.categories-list');
  });
});

test('displays WIP for score when addon is WIP', function(assert) {
  let addon = server.create('addon', {
    name: 'test-wip',
    isWip: true
  });

  visitAddon(addon);

  andThen(function() {
    assert.contains('.score', 'WIP', 'Displays WIP for score');
  });
});

test('displays N/A for score when addon has no score', function(assert) {
  let addon = server.create('addon', {
    name: 'test-with-na-score',
    score: null
  });

  visitAddon(addon);

  andThen(function() {
    assert.contains('.score', 'N/A', 'Displays N/A for score when addon has no score');
  });
});

test('displays note', function(assert) {
  let addon = server.create('addon', {
    name: 'test-addon-with-note',
    note: '#MdNote'
  });

  visitAddon(addon);

  andThen(function() {
    assert.contains('.test-addon-note h1', 'MdNote', 'Note is rendered');
  });
});

test('displays categories', function(assert) {
  let categoryA = server.create('category', {
    name: 'A category for categories'
  });

  let categoryB = server.create('category', {
    name: 'Another category for categories'
  });

  let addon = server.create('addon', {
    name: 'test-addon-with-categories'
  });

  addon.update({ categoryIds: [categoryA.id, categoryB.id] });

  visitAddon(addon);

  andThen(function() {
    assert.contains('.test-category-list', 'A category for categories');
    assert.contains('.test-category-list', 'Another category for categories');
  });
});

test('displays github data', function(assert) {
  let users = server.createList('github-users', 2);
  let addon = server.create('addon', {
    name: 'test-addon-with-github-data',
    isTopStarred: true,
    githubUsers: users
  });

  server.create('github-stats', {
    openIssues: 13,
    forks: 94,
    stars: 37,
    latestCommitDate: window.moment().subtract(2, 'months').toString(),
    firstCommitDate: window.moment().subtract(1, 'years').toString(),
    addonId: addon.id
  });

  visitAddon(addon);

  click('.info-action');

  andThen(function() {
    assert.contains('.test-github-data', 'TOP 10% STARRED');
    assert.containsExactly('.test-open-issues', '13 Open Issues');
    assert.containsExactly('.test-forks', '94 Forks');
    assert.containsExactly('.test-stars', '37 Starred');
    assert.containsExactly('.test-contributors', '2 Contributors');
    assert.containsExactly('.test-latest-commit time', '2 months ago');
    assert.containsExactly('.test-first-commit time', 'a year ago');
    assert.exists('.test-has-github-data', 'Displays score detail Github data');
  });
});

test('displays header', function(assert) {
  let addon = server.create('addon', {
    name: 'test-addon'
  });

  visitAddon(addon);

  andThen(function() {
    assert.contains('.test-addon-header', 'test-addon', 'Header displays addon name');
    assert.notExists('.test-addon-flag-deprecation', 'Deprecation flag does not display');
    assert.notExists('.test-addon-flag-new', 'New flag does not display');
    assert.notExists('.test-addon-flag-official', 'Official flag does not display');
    assert.notExists('.test-addon-flag-cli-dependency', 'CLI Dependency flag does not display');
  });

  let addonWithFlags = server.create('addon', {
    name: 'test-addon-with-flags',
    isDeprecated: true,
    isOfficial: true,
    isCliDependency: true,
    publishedDate: moment().subtract(1, 'week').toString()
  });

  visitAddon(addonWithFlags);

  andThen(function() {
    assert.contains('.test-addon-header', 'test-addon', 'Header displays addon name');
    assert.exists('.test-addon-flag-deprecation', 'Deprecation flag displays');
    assert.exists('.test-addon-flag-new', 'New flag displays');
    assert.exists('.test-addon-flag-official', 'Official flag displays');
    assert.exists('.test-addon-flag-cli-dependency', 'CLI Dependency flag displays');
  });
});

test('displays review', function(assert) {
  let addon = server.create('addon', {
    name: 'test-addon'
  });

  visitAddon(addon);

  andThen(function() {
    assert.exists('.test-no-review', 'Warning about not yet reviewed appears');
  });

  let addonWithReview = server.create('addon', {
    name: 'test-addon-with-review'
  });

  let review = server.create('review', {
    addonId: addonWithReview.id,
    hasTests: 1,
    hasReadme: 4,
    isMoreThanEmptyAddon: 3,
    isOpenSource: 2,
    hasBuild: 1,
    review: 'Seems ok'
  });

  let addonVersion = server.create('version', {
    addon: addonWithReview,
    review,
    released: window.moment().subtract(3, 'months')
  });

  // Newer version without review
  server.create('version', {
    addon: addonWithReview,
    review: null,
    released: window.moment().subtract(1, 'months')
  });

  review.update('versionId', addonVersion.id);

  visitAddon(addonWithReview);

  click('.info-action');

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

    assert.contains('.test-latest-review-score', '2 points from review', 'Displays latest review score');
    assert.contains('.test-release-published-in-last-three-months', '1 point for having published a release within the last 3 months', 'Displays latest review score');
  });
});

test('displays addon stats', function(assert) {
  let maintainers = server.createList('maintainer', 3);

  let keywords = server.createList('keyword', 5);
  let addon = server.create('addon', {
    name: 'test-addon',
    maintainerIds: maintainers.map((m) => m.id),
    latestVersionDate: window.moment().subtract(3, 'months'),
    isTopDownloaded: true,
    lastMonthDownloads: 1564,
    demoUrl: 'http://www.example.com/demo_of_addon',
    repositoryUrl: 'http://www.example.com/addon_repo',
    license: 'MIT',
    keywords
  });

  server.create('version', {
    version: '1.0.1',
    addonId: addon.id,
    emberCliVersion: '1.13.1',
    released: window.moment().subtract(3, 'months')
  });

  server.create('version', {
    version: '1.0.0',
    addonId: addon.id,
    emberCliVersion: '1.13.0',
    released: window.moment().subtract(4, 'months')
  });

  server.get('https://api.github.com/repos/emberjs/ember.js/releases', function(/* db, request*/) {
    let version = Ember.copy(EmberVersionsResponse[0]);
    version.published_at = window.moment().subtract(14, 'weeks');      // eslint-disable-line camelcase
    version.tag_name = 'v15.0.0';                                      // eslint-disable-line camelcase
    let olderVersion = Ember.copy(EmberVersionsResponse[1]);
    olderVersion.published_at = window.moment().subtract(5, 'months'); // eslint-disable-line camelcase
    olderVersion.tag_name = 'v14.0.0';                                 // eslint-disable-line camelcase

    return [version, olderVersion];
  });

  visitAddon(addon);

  andThen(function() {
    assert.contains('.test-addon-install-command', 'ember install test-addon');

    assert.contains('.test-addon-latest-version', '1.0.1 from 3 months ago');

    assert.contains('.test-addon-top-downloaded', 'TOP 10%');
    assert.contains('.test-addon-top-downloaded', '1,564 downloads in last month');

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
    assert.exists('.test-addon-versions li', 3, 'Only 3 list items should be under versions, 2 for versions, 1 for ember verions after publishing of addon');
    assert.contains('.test-addon-versions li:eq(0)', '1.0.1');
    assert.contains('.test-addon-versions li:eq(1)', 'Ember v15.0.0');
    assert.contains('.test-addon-versions li:eq(2)', '1.0.0');

    assert.exists('.test-addon-badge img[src="https://emberobserver.com/badges/test-addon.svg"]');
    assert.exists('.test-addon-badge .test-show-badge-markdown.icon-content-paste', 'Show badge markdown to copy');
    assert.contains('.test-addon-correction-link[href*="/addons/test-addon/correct"]', 'Suggest a correction');
  });

  click('.test-addon-badge .test-show-badge-markdown');
  andThen(function() {
    assert.contains('.test-addon-badge .test-badge-markdown', '[![Ember Observer Score](https://emberobserver.com/badges/test-addon.svg)](https://emberobserver.com/addons/test-addon)');
  });
});

test('addon has an invalid github repo', function(assert) {
  let addon = server.create('addon', {
    name: 'test-addon',
    hasInvalidGithubRepo: true
  });

  visitAddon(addon);

  andThen(function() {
    assert.exists('.test-addon-flag-invalid-repo', 'displays invalid repo message');
    assert.notExists('.test-addon-repo-url a', 'does not display repo url');
    assert.notExists('.readme', 'does not display readme');
  });
});

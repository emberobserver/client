import { click, currentRouteName, currentURL, visit, findAll } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { percySnapshot } from 'ember-percy';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';
import moment from 'moment';
import visitAddon from '../helpers/visit-addon';
import Mirage from 'ember-cli-mirage';
import { setupOnerror, resetOnerror } from '@ember/test-helpers';

module('Acceptance: Addons', function(hooks) {
  setupEmberObserverTest(hooks);

  test('addon not found', async function(assert) {
    await visit('/addons/ember-nonexistent-addon');

    await percySnapshot('/addons/ember-nonexistent-addon');

    assert.equal(currentURL(), '/addons/ember-nonexistent-addon');
    assert.dom('.test-not-found').hasText("Oops! We can't find what you were looking for. Try searching above?");
  });

  test('displays 0 for score when addon has zero score', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-with-zero-score',
      hasBeenReviewed: true,
      score: 0
    });

    await visitAddon(addon);

    assert.dom('.score').hasText('Score 0.0', 'Displays 0 for score when addon has a score of zero');
  });

  test('Does not display category list', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon'
    });

    await visitAddon(addon);

    assert.dom('.categories-list').doesNotExist();
  });

  test('displays WIP for score when addon is WIP', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-wip',
      isWip: true
    });

    await visitAddon(addon);

    assert.dom('.score').containsText('WIP', 'Displays WIP for score');
  });

  test('displays ? for score when addon has no score', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-with-na-score',
      score: null
    });

    await visitAddon(addon);

    assert.dom('.score').containsText('?', 'Displays ? for score when addon has no score');
  });

  test('displays note', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon-with-note',
      note: '#MdNote'
    });

    await visitAddon(addon);

    assert.dom('.test-addon-note h1').hasText('MdNote', 'Note is rendered');
  });

  test('displays categories', async function(assert) {
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

    await visitAddon(addon);

    assert.dom('.test-category-list').containsText('A category for categories');
    assert.dom('.test-category-list').containsText('Another category for categories');
  });

  test('displays n/a warning for score info on addon that has not been reviewed', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon-not-reviewed',
      hasBeenReviewed: false,
    });

    await visitAddon(addon);

    await click('.test-show-score-explanation');

    assert.dom('.test-not-reviewed-warning').containsText('N/A - This addon has not yet been reviewed.');
  });

  test('displays score calculation', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon-with-score-calc',
      hasBeenReviewed: true,
    });

    server.create('score-calculation', {
      addon,
      info: {
        checks: [
          {
            explanation: 'The addon only uses sustainably-sourced coffee',
            contribution: .233,
            maxContribution: .3333,
          },
          {
            explanation: 'Mines bitcoin',
            contribution: 0.1,
            maxContribution: .3333,
          },
          {
            explanation: 'Makes breakfast for me',
            contribution: .333,
            maxContribution: .3333,
          }
        ]
      }
    });

    await visitAddon(addon);

    await click('.test-show-score-explanation');

    let checks = document.querySelectorAll('.test-score-component');
    assert.dom(checks[0]).containsText('The addon only uses sustainably-sourced coffee');
    assert.dom('.test-value', checks[0]).containsText('0.7');
    assert.dom('.test-value', checks[0]).hasClass('yellow', 'Has class to indicate mediocre check passing percentage');
    assert.dom('.test-max-contribution', checks[0]).containsText('3.33', 'Displays max contribution in the scale of the score');

    assert.dom(checks[1]).containsText('Mines bitcoin');
    assert.dom('.test-value', checks[1]).containsText('0.3');
    assert.dom('.test-value', checks[1]).hasClass('red', 'Has class to indicate poor check passing percentage');
    assert.dom('.test-max-contribution', checks[1]).containsText('3.33', 'Displays max contribution in the scale of the score');

    assert.dom(checks[2]).containsText('Makes breakfast for me');
    assert.dom('.test-value', checks[2]).containsText('1');
    assert.dom('.test-value', checks[2]).hasClass('green', 'Has class to indicate perfect check passing percentage');
    assert.dom('.test-max-contribution', checks[2]).containsText('3.33', 'Displays max contribution in the scale of the score');
  });

  test('displays github data', async function(assert) {
    let users = server.createList('github-user', 2);
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

    await visitAddon(addon);

    await click('.info-action');

    await percySnapshot('/addons/show | with github data');

    assert.dom('.test-github-data').containsText('TOP 10% STARRED');
    assert.dom('.test-open-issues').containsText('13');
    assert.dom('.test-open-issues').containsText('Open Issues');
    assert.dom('.test-forks').containsText('94');
    assert.dom('.test-forks').containsText('Forks');
    assert.dom('.test-stars').containsText('37');
    assert.dom('.test-stars').containsText('Starred');
    assert.dom('.test-contributors').containsText('2');
    assert.dom('.test-contributors').containsText('Contributors');
    assert.dom('.test-latest-commit time').hasText('2 months ago');
    assert.dom('.test-first-commit time').hasText('a year ago');
  });

  test('displays header', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon'
    });

    await visitAddon(addon);

    assert.dom('.test-addon-header').containsText('test-addon', 'Header displays addon name');
    assert.dom('.test-addon-flag-deprecation').doesNotExist('Deprecation flag does not display');
    assert.dom('.test-addon-flag-new').doesNotExist('New flag does not display');
    assert.dom('.test-addon-flag-official').doesNotExist('Official flag does not display');
    assert.dom('.test-addon-flag-cli-dependency').doesNotExist('CLI Dependency flag does not display');

    let addonWithFlags = server.create('addon', {
      name: 'test-addon-with-flags',
      isDeprecated: true,
      isOfficial: true,
      isCliDependency: true,
      publishedDate: moment().subtract(1, 'week').toString()
    });

    await visitAddon(addonWithFlags);

    assert.dom('.test-addon-header').containsText('test-addon', 'Header displays addon name');
    assert.dom('.test-addon-flag-deprecation').exists('Deprecation flag displays');
    assert.dom('.test-addon-flag-new').exists('New flag displays');
    assert.dom('.test-addon-flag-official').exists('Official flag displays');
    assert.dom('.test-addon-flag-cli-dependency').exists('CLI Dependency flag displays');
  });

  test('displays review', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon'
    });

    await visitAddon(addon);

    assert.dom('.test-no-review').exists('Warning about not yet reviewed appears');

    let addonWithReview = server.create('addon', {
      name: 'test-addon-with-review'
    });

    let review = server.create('review', {
      addonId: addonWithReview.id,
      hasTests: 1,
      hasReadme: 4,
      hasBuild: 1,
      review: 'Seems ok'
    });

    addonWithReview.latestReview = review;
    addonWithReview.save();

    let addonVersion = server.create('version', {
      addon: addonWithReview,
      review,
      released: window.moment().subtract(3, 'months')
    });

    // Newer version without review
    let newerVersion = server.create('version', {
      addon: addonWithReview,
      review: null,
      released: window.moment().subtract(1, 'months')
    });

    review.update('versionId', addonVersion.id);
    addonWithReview.update('latestAddonVersionId', newerVersion.id);

    await visitAddon(addonWithReview);

    await click('.info-action');

    await percySnapshot('/addons/show | with review');

    let questions = findAll('.test-review-question');
    assert.dom(questions[0]).hasText('Are there meaningful tests? Yes');
    assert.dom(questions[1]).hasText('Is the README filled out? Unknown');
    assert.dom(questions[2]).hasText('Does the addon have a build? Yes');

    assert.dom('.test-review-notes').hasText('Seems ok');
    assert.dom('.test-review-new-version-warning').hasText('New versions of this addon have been released since this review was undertaken.');
  });

  test('displays addon stats', async function(assert) {
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

    let version = server.create('version', {
      version: '1.0.1',
      addonId: addon.id,
      emberCliVersion: '1.13.1',
      released: window.moment().subtract(3, 'months')
    });

    addon.update('latestAddonVersion', version);

    server.create('version', {
      version: '1.0.0',
      addonId: addon.id,
      emberCliVersion: '1.13.0',
      released: window.moment().subtract(4, 'months')
    });

    server.create('ember-version', {
      version: 'v15.0.0',
      released: moment().subtract(14, 'weeks')
    });
    server.create('ember-version', {
      version: 'v14.0.0',
      released: moment().subtract(5, 'months')
    });

    await visitAddon(addon);

    assert.dom('.test-addon-install-command').hasText('ember install test-addon');

    assert.dom('.test-addon-latest-version').hasText('1.0.1 from 3 months ago');

    assert.dom('.test-addon-top-downloaded').containsText('TOP 10%');
    assert.dom('.test-addon-top-downloaded').containsText('1,564 downloads in last month');

    assert.dom('.test-addon-demo-url a[href="http://www.example.com/demo_of_addon"]').exists();
    assert.dom('.test-addon-demo-url').containsText('example.com/demo_of_addon');

    assert.dom('.test-addon-repo-url a[href="http://www.example.com/addon_repo"]').exists();
    assert.dom('.test-addon-repo-url').containsText('example.com/addon_repo');

    assert.dom('.test-addon-package-url a[href="https://www.npmjs.com/package/test-addon"]').exists();
    assert.dom('.test-addon-package-url').containsText('npmjs.com/package/test-addon');

    assert.dom('.test-addon-license a[href="https://spdx.org/licenses/MIT"]').hasText('MIT');
    assert.dom('.test-addon-keywords').hasText('keyword-0, keyword-1, keyword-2, keyword-3, keyword-4');

    assert.dom('.test-addon-maintainers a').exists({ count: 3 }, 'maintainers should display');
    assert.dom('.test-addon-maintainers a[href*="/maintainers/maintainer-0"]').exists('maintainers should have link to them');
    assert.dom('.test-addon-maintainers img[src="https://secure.gravatar.com/avatar/412412d3d6d6fc8809f9121216dd0?d=identicon"]').exists('maintainers should have gravatar');
    assert.dom('.test-addon-maintainers img[title="maintainer-0"][alt="maintainer-0"]').exists('Title and source of gravatar are set');

    assert.dom('.test-addon-ember-cli-version').hasText('1.13.1');

    assert.dom('.test-addon-version-count').hasText('versions (2)');
    assert.dom('.test-addon-versions li').exists({ count: 3 }, 'Only 3 list items should be under versions, 2 for versions, 1 for ember versions after publishing of addon');
    let versionListItems = findAll('.test-addon-versions li');
    assert.dom(versionListItems[0]).containsText('1.0.1');
    assert.dom(versionListItems[1]).containsText('Ember v15.0.0');
    assert.dom(versionListItems[2]).containsText('1.0.0');

    assert.dom('.test-addon-badge img[src="/badges/test-addon.svg"]').exists();
    assert.dom('.test-addon-badge .test-show-badge-markdown .icon-content-paste').exists('Show badge markdown to copy');

    await click('.test-addon-badge .test-show-badge-markdown');
    assert.dom('.test-addon-badge .test-badge-markdown').hasText('[![Ember Observer Score](https://emberobserver.com/badges/test-addon.svg)](https://emberobserver.com/addons/test-addon)');
  });

  test('addon has an invalid github repo', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon',
      hasInvalidGithubRepo: true
    });

    await visitAddon(addon);

    assert.dom('.test-addon-flag-invalid-repo').exists('displays invalid repo message');
    assert.dom('.test-addon-repo-url a').doesNotExist('does not display repo url');
    assert.dom('.readme').doesNotExist('does not display readme');
  });

  test('displays addon dependencies', async (assert) => {
    let addon = server.create('addon');
    let latestVersion = server.create('version', {
      addon
    });

    addon.latestAddonVersion = latestVersion;
    addon.save();

    let dependency = server.create('addon-dependency', {
      dependentVersion: latestVersion,
      dependencyType: 'dependencies'
    });

    let devDependency = server.create('addon-dependency', {
      dependentVersion: latestVersion,
      dependencyType: 'devDependencies'
    });

    await visitAddon(addon);

    assert.dom('.test-addon-dependencies .test-dependencies .test-dependency-name').hasText(dependency.package);
    assert.dom('.test-addon-dependencies .test-dependency-name').hasText(devDependency.package);
  });

  test('hides some dependencies if there are over a certain amount', async function(assert) {
    let addon = server.create('addon');
    let latestVersion = server.create('version', {
      addon
    });

    addon.latestAddonVersion = latestVersion;
    addon.save();

    server.createList('addon-dependency', 10, {
      dependentVersion: latestVersion,
      dependencyType: 'dependencies'
    });

    server.createList('addon-dependency', 11, {
      dependentVersion: latestVersion,
      dependencyType: 'devDependencies'
    });

    await visitAddon(addon);

    let dependencyPackages = findAll('.test-addon-dependencies .test-dependencies .test-dependency-name');
    assert.equal(8, dependencyPackages.length, 'Shows truncated list of dependencies');

    let devDependencyPackages = findAll('.test-addon-dependencies .test-dev-dependencies .test-dependency-name');
    assert.equal(8, devDependencyPackages.length, 'Shows list of dev dependencies');

    await click('.test-addon-dependencies .test-show-all-dependencies');

    dependencyPackages = findAll('.test-addon-dependencies .test-dependencies .test-dependency-name');
    assert.equal(10, dependencyPackages.length, 'Shows full list of dependencies');

    devDependencyPackages = findAll('.test-addon-dependencies .test-dev-dependencies .test-dependency-name');
    assert.equal(11, devDependencyPackages.length, 'Shows full list of dependencies');
  });

  test('when there are no addon dependencies', async (assert) => {
    let addon = server.create('addon');
    let latestVersion = server.create('version', {
      addon
    });

    addon.latestAddonVersion = latestVersion;
    addon.save();

    await visitAddon(addon);

    assert.dom('.test-addon-dependencies .test-no-addons-message').exists();
    assert.dom('.test-addon-dependencies .test-dependencies').doesNotExist();
    assert.dom('.test-addon-dependencies .test-dev-dependencies').doesNotExist();
  });

  test('displays addon dependents', async(assert) => {
    let addon = server.create('addon');
    let latestVersion = server.create('version', {
      addon
    });

    addon.latestAddonVersion = latestVersion;
    addon.save();

    server.createList('addon-dependency', 7, {
      dependentVersion: server.create('version'),
      dependencyType: 'dependencies',
      package: addon.name,
    });

    server.createList('addon-dependency', 11, {
      dependentVersion: server.create('version'),
      dependencyType: 'devDependencies',
      package: addon.name,
    });

    await visitAddon(addon);

    assert.dom('.test-addon-dependents .test-dependencies').doesNotExist('Not showing dependents');
    assert.dom('.test-addon-dependents .test-dev-dependencies').doesNotExist('Not showing dependents');

    await click('.test-show-dependents');

    let dependencyPackages = findAll('.test-addon-dependents .test-dependencies .test-dependency-name');
    assert.equal(dependencyPackages.length, 7, 'Shows list of dependent addons');

    let devDependencyPackages = findAll('.test-addon-dependents .test-dev-dependencies .test-dependency-name');
    assert.equal(devDependencyPackages.length, 8, 'Shows list of dev dependent addons');
  });

  test('when addon dependencies fail to load', async(assert) => {
    let addon = server.create('addon');
    let latestVersion = server.create('version', {
      addon
    });

    addon.latestAddonVersion = latestVersion;
    addon.save();

    setupOnerror(() => {});

    await visitAddon(addon);

    server.get('/addon-dependencies', () => {
      return new Mirage.Response(400);
    });

    await click('.test-show-dependents');

    assert.dom('.test-addon-dependents .test-uncollapse-error').exists('Shows error message');
    resetOnerror();
  });

  test('has a link for users to provide suggestions', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon',
    });

    await visitAddon(addon);

    await click('.test-addon-correction-link');

    await percySnapshot('/addons/correct');

    assert.equal(currentURL(), '/addons/test-addon/correct', 'suggest a correction link works');
  });

  module('Scoped addons', function(hooks) {
    hooks.beforeEach(function() {
      this.addon = server.create('addon', {
        name: '@foo-bar/test-addon'
      });
    });

    test('can view a scoped addon with a / in the URL', async function(assert) {
      await visit('/addons/@foo-bar/test-addon');

      assert.equal(currentRouteName(), 'addons.show');
    });

    test('can view a scoped addon with / encoded in the URL', async function(assert) {
      await visit('/addons/@foo-bar%2Ftest-addon');

      assert.equal(currentRouteName(), 'addons.show');
    });

    test('displays badge for scoped addon', async function(assert) {
      await visitAddon(this.addon);

      assert.dom('.test-addon-badge img[src="/badges/-foo-bar-test-addon.svg"]').exists();

      await click('.test-addon-badge .test-show-badge-markdown');
      assert.dom('.test-addon-badge .test-badge-markdown').hasText('[![Ember Observer Score](https://emberobserver.com/badges/-foo-bar-test-addon.svg)](https://emberobserver.com/addons/@foo-bar/test-addon)');
    });

  });
});

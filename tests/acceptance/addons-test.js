import { click, currentRouteName, currentURL, visit, findAll } from '@ember/test-helpers';
import { copy } from '@ember/object/internals';
import { module, test } from 'qunit';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';
import visitAddon from '../helpers/visit-addon';
import { enableFeature } from 'ember-feature-flags/test-support';
import EmberVersionsResponse from '../ember-version-response';
import moment from 'moment';

module('Acceptance: Addons', function(hooks) {
  setupEmberObserverTest(hooks);

  test('addon not found', async function(assert) {
    await visit('/addons/what');
    assert.equal(currentURL(), '/model-not-found');
    assert.dom('.test-not-found').hasText("Oops! We can't find what you were looking for. Try searching above?");
  });

  test('displays 0 for score when addon has zero score', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-with-zero-score',
      score: 0
    });

    await visitAddon(addon);

    assert.dom('.score').hasText('Score 0', 'Displays 0 for score when addon has a score of zero');
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

  test('displays N/A for score when addon has no score', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-with-na-score',
      score: null
    });

    await visitAddon(addon);

    assert.dom('.score').containsText('N/A', 'Displays N/A for score when addon has no score');
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

  test('displays github data', async function(assert) {
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

    await visitAddon(addon);

    await click('.info-action');

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
    assert.dom('.test-has-github-data').exists('Displays score detail Github data');
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

    let questions = findAll('.test-review-question');
    assert.dom(questions[0]).hasText('Are there meaningful tests? Yes');
    assert.dom(questions[1]).hasText('Is the README filled out? Unknown');
    assert.dom(questions[2]).hasText('Does the addon have a build? Yes');

    assert.dom('.test-review-notes').hasText('Seems ok');
    assert.dom('.test-review-new-version-warning').hasText('New versions of this addon have been released since this review was undertaken.');
    assert.dom('.test-latest-review-score').hasText('4 points from review', 'Displays latest review score');
    assert.dom('.test-release-published-in-last-three-months').hasText('1 point for having published a release within the last 3 months', 'Displays latest review score');
  });

  test('displays addon stats with new EmberVersions model', async function(assert) {
    enableFeature('ember-versions-model');
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

    let newestVersion = server.create('version', {
      version: '1.0.1',
      addonId: addon.id,
      emberCliVersion: '1.13.1',
      released: window.moment().subtract(3, 'months')
    });

    addon.update('latestAddonVersion', newestVersion);

    server.create('version', {
      version: '1.0.0',
      addonId: addon.id,
      emberCliVersion: '1.13.0',
      released: window.moment().subtract(4, 'months')
    });

    let version = copy(EmberVersionsResponse[0]);
    version.published_at = window.moment().subtract(14, 'weeks');      // eslint-disable-line camelcase
    version.tag_name = 'v15.0.0';                                      // eslint-disable-line camelcase
    let olderVersion = copy(EmberVersionsResponse[1]);
    olderVersion.published_at = window.moment().subtract(5, 'months'); // eslint-disable-line camelcase
    olderVersion.tag_name = 'v14.0.0';                                 // eslint-disable-line camelcase

    let emberVersionsData = [version, olderVersion];

    server.create('ember-versions', { githubResponse: emberVersionsData });

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
    assert.dom('.test-addon-versions li').exists({ count: 3 }, 'Only 3 list items should be under versions, 2 for versions, 1 for ember verions after publishing of addon');
    let versionListItems = findAll('.test-addon-versions li');
    assert.dom(versionListItems[0]).containsText('1.0.1');
    assert.dom(versionListItems[1]).containsText('Ember v15.0.0');
    assert.dom(versionListItems[2]).containsText('1.0.0');

    assert.dom('.test-addon-badge img[src="/badges/test-addon.svg"]').exists();
    assert.dom('.test-addon-badge .test-show-badge-markdown.icon-content-paste').exists('Show badge markdown to copy');
    assert.dom('.test-addon-correction-link[href*="/addons/test-addon/correct"]').exists('Suggest a correction');

    await click('.test-addon-badge .test-show-badge-markdown');
    assert.dom('.test-addon-badge .test-badge-markdown').hasText('[![Ember Observer Score](https://emberobserver.com/badges/test-addon.svg)](https://emberobserver.com/addons/test-addon)');
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

    server.get('https://api.github.com/repos/emberjs/ember.js/releases', function(/* db, request*/) {
      let version = copy(EmberVersionsResponse[0]);
      version.published_at = window.moment().subtract(14, 'weeks');      // eslint-disable-line camelcase
      version.tag_name = 'v15.0.0';                                      // eslint-disable-line camelcase
      let olderVersion = copy(EmberVersionsResponse[1]);
      olderVersion.published_at = window.moment().subtract(5, 'months'); // eslint-disable-line camelcase
      olderVersion.tag_name = 'v14.0.0';                                 // eslint-disable-line camelcase

      return [version, olderVersion];
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
    assert.dom('.test-addon-versions li').exists({ count: 3 }, 'Only 3 list items should be under versions, 2 for versions, 1 for ember verions after publishing of addon');
    let versionListItems = findAll('.test-addon-versions li');
    assert.dom(versionListItems[0]).containsText('1.0.1');
    assert.dom(versionListItems[1]).containsText('Ember v15.0.0');
    assert.dom(versionListItems[2]).containsText('1.0.0');

    assert.dom('.test-addon-badge img[src="/badges/test-addon.svg"]').exists();
    assert.dom('.test-addon-badge .test-show-badge-markdown.icon-content-paste').exists('Show badge markdown to copy');
    assert.dom('.test-addon-correction-link[href*="/addons/test-addon/correct"]').exists('Suggest a correction');

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

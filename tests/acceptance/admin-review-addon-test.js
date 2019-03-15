import {
  click,
  currentURL,
  fillIn,
  findAll,
  visit,
} from '@ember/test-helpers';
import { module, test } from 'qunit';
import { percySnapshot } from 'ember-percy';
import { selectChoose } from 'ember-power-select/test-support/helpers';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';
import findByText from '../helpers/find-by-text';
import login from 'ember-observer/tests/helpers/login';
import Mirage from 'ember-cli-mirage';
import moment from 'moment';

let windowAlert;

module('Acceptance | admin review addon', function(hooks) {
  setupEmberObserverTest(hooks);

  hooks.before(function() {
    QUnit.assert.onCorrectAddonPage = function(addon) { // eslint-disable-line no-undef
      this.dom('.test-addon-link').includesText(addon.name, 'Page renders');
    };
  });

  hooks.beforeEach(async function() {
    windowAlert = window.alert;

    window.alert = function(message) {
      throw new Error(message);
    };

    await login();
  });

  hooks.afterEach(function() {
    window.alert = windowAlert;
  });

  hooks.after(function() {
    delete QUnit.assert.onCorrectAddonPage; // eslint-disable-line no-undef
  });

  test('addon not found', async function(assert) {
    await visit('/admin/review/what');
    assert.equal(currentURL(), '/admin/review/what', 'preserves URL');
    assert.dom('.test-not-found').hasText("Oops! We can't find what you were looking for. Try searching above?");
  });

  test('Has a descriptive page title', async function(assert) {
    let addon = server.create('addon', {
      name: 'fake-addon',
    });

    await visitAddon(addon);

    assert.equal(document.title, 'Admin | Review | fake-addon - Ember Observer');
  });

  test('Displays hidden addons', async function(assert) {
    let addon = server.create('addon', {
      name: 'fake-addon',
      isHidden: true
    });

    await visitAddon(addon);

    assert.onCorrectAddonPage(addon);
  });

  test('Displays basic info about addon', async function(assert) {
    let addon = server.create('addon', {
      name: 'fake-addon',
      description: 'Foo bar baz',
      latestVersionDate: moment().subtract(1, 'day').toISOString(),
      score: 5,
      hasBeenReviewed: true,
      repositoryUrl: 'http://example.com/fake-addon',
      demoUrl: 'http://example.org/demo',
    });

    let newestAddonVersion = server.create('version', {
      addon,
      version: '1.1.3',
    });

    addon.update('latestAddonVersionId', newestAddonVersion.id);

    await visitAddon(addon);

    await percySnapshot('/admin/review/addon');

    assert.dom('.test-addon-link').includesText('fake-addon');
    assert.dom('.test-description').includesText('Foo bar baz');
    assert.dom('.test-last-updated').hasText('1.1.3 from a day ago');
    assert.dom('.test-addon-demo-url').includesText('http://example.org/demo');
    assert.dom('.test-addon-package-url').includesText('https://www.npmjs.com/package/fake-addon');
    assert.dom('.test-score').hasText('5.0');
    assert.dom('.test-repo-url').hasText('http://example.com/fake-addon');
    assert.dom('.test-repo-url').hasAttribute('href', 'http://example.com/fake-addon');
    assert.dom('.test-repo-url').hasAttribute('target', 'repo', 'Has fixed target to facilitate multi-window workflow');
  });

  test('Displays stars next to addon name, if applicable', async function(assert) {
    let normalAddon = server.create('addon', {
      name: 'normal-addon',
    });

    let decoratedAddon = server.create('addon', {
      name: 'decorated-addon',
      isOfficial: true,
      isCliDependency: true,
    });

    await visitAddon(normalAddon);

    assert.onCorrectAddonPage(normalAddon);
    assert.dom('.test-official-icon').doesNotExist();
    assert.dom('.test-cli-dep-icon').doesNotExist();

    await visitAddon(decoratedAddon);

    assert.onCorrectAddonPage(decoratedAddon);
    assert.dom('.test-official-icon').exists();
    assert.dom('.test-cli-dep-icon').exists();
  });

  test('Toggle switches', async function(assert) {
    let addon = server.create('addon', {
      name: 'fake-addon',
      repositoryUrl: 'http://example.com/fake-addon',
      hasInvalidGithubRepo: false,
      isWip: true,
      isDeprecated: false,
      isHidden: true,
      isOfficial: true,
      isCliDependency: true,
    });

    await visitAddon(addon);

    assert.onCorrectAddonPage(addon);

    assertToggleState(assert, '.test-toggle-repo-validity', { checked: true, text: 'Has valid Repo URL' });

    await toggle('.test-toggle-repo-validity');

    assertToggleState(assert, '.test-toggle-repo-validity', { checked: false, text: 'Has invalid Repo URL' });

    assertToggleState(assert, '.test-toggle-is-wip', { checked: false, text: 'Is a WIP' });

    await toggle('.test-toggle-is-wip');

    assertToggleState(assert, '.test-toggle-is-wip', { checked: true, text: 'Not a WIP' });

    assertToggleState(assert, '.test-toggle-is-deprecated', { checked: true, text: 'Active' });

    await toggle('.test-toggle-is-deprecated');

    assertToggleState(assert, '.test-toggle-is-deprecated', { checked: false, text: 'Deprecated' });

    assertToggleState(assert, '.test-toggle-is-hidden', { checked: false, text: 'Hidden' });

    await toggle('.test-toggle-is-hidden');

    assertToggleState(assert, '.test-toggle-is-hidden', { checked: true, text: 'Visible' });

    assertToggleState(assert, '.test-toggle-is-official', { checked: true, text: 'Is Official?' });

    await toggle('.test-toggle-is-official');

    assertToggleState(assert, '.test-toggle-is-official', { checked: false, text: 'Is Official?' });

    assertToggleState(assert, '.test-toggle-is-cli-dep', { checked: true, text: 'Is CLI Dependency?' });

    await toggle('.test-toggle-is-cli-dep');

    assertToggleState(assert, '.test-toggle-is-cli-dep', { checked: false, text: 'Is CLI Dependency?' });

    await toggle('.test-toggle-extends-ember');

    assertToggleState(assert, '.test-toggle-extends-ember', { checked: true, text: 'Extends Ember?' });

    await toggle('.test-toggle-extends-ember-cli');

    assertToggleState(assert, '.test-toggle-extends-ember-cli', { checked: true, text: 'Extends Ember CLI?' });

    await toggle('.test-toggle-is-monorepo');

    assertToggleState(assert, '.test-toggle-is-monorepo', { checked: true, text: 'Is Monorepo?' });

    await click('.test-save-addon');

    addon.reload();

    assert.equal(addon.hasInvalidGithubRepo, true, 'Toggle invalid repo saves');
    assert.equal(addon.isWip, false, 'Toggle isWip saves');
    assert.equal(addon.isDeprecated, true, 'Toggle isDeprecated saves');
    assert.equal(addon.isHidden, false, 'Toggle isHidden saves');
    assert.equal(addon.isOfficial, false, 'Toggle isOfficial saves');
    assert.equal(addon.isCliDependency, false, 'Toggle isCliDependency saves');
    assert.equal(addon.extendsEmber, true, 'Toggle extendsEmber saves');
    assert.equal(addon.extendsEmberCli, true, 'Toggle extendsEmberCli saves');
    assert.equal(addon.isMonorepo, true, 'Toggle isMonorepo saves');
  });

  test('Addon note', async function(assert) {
    let addon = server.create('addon', {
      name: 'fake-addon',
      note: 'Stuff and things',
    });

    await visitAddon(addon);

    assert.onCorrectAddonPage(addon);
    assert.dom('.test-note-input').hasValue('Stuff and things');

    await fillIn('.test-note-input', 'Air and water');
    await click('.test-save-addon');

    addon.reload();
    assert.equal(addon.note, 'Air and water', 'Note is updated');
  });

  test('Override repository URL', async function(assert) {
    let addon = server.create('addon', {
      name: 'fake-addon',
      overrideRepositoryUrl: 'http://example.com',
    });

    await visitAddon(addon);

    assert.onCorrectAddonPage(addon);
    assert.dom('.test-override-repo-url-input').hasValue('http://example.com');

    await fillIn('.test-override-repo-url-input', 'http://example.org');
    await click('.test-save-addon');

    addon.reload();
    assert.equal(addon.overrideRepositoryUrl, 'http://example.org', 'Override repo url is updated');
  });

  test('Editing categories', async function(assert) {
    let categoryA = server.create('category', {
      name: 'Pets',
      description: 'Domesticated animals'
    });

    let categoryB = server.create('category', {
      name: 'Cats',
      parentId: categoryA.id,
      description: 'Feline pets'
    });

    let categoryC = server.create('category', {
      name: 'Bears',
      description: 'Wild animals'
    });

    let addon = server.create('addon', {
      name: 'fake-addon',
      categoryIds: [categoryC.id]
    });

    await visitAddon(addon);

    assert.onCorrectAddonPage(addon);
    await assert.powerSelectOptionsAre('.test-category-chooser', '.test-category-chooser-dropdown', ['Bears', 'Pets · Domesticated animals', 'Pets > Cats · Feline pets'], 'All categories are options, sorted by displayName; descriptions only display for non-selected options');
    assert.powerSelectMultipleOptionSelected('.test-category-chooser', 'Bears');

    await selectChoose('.test-category-chooser', 'Pets > Cats · Feline pets');
    assert.powerSelectMultipleOptionSelected('.test-category-chooser', 'Bears');
    assert.powerSelectMultipleOptionSelected('.test-category-chooser', 'Pets > Cats');

    await click('.test-save-addon');

    addon.reload();
    assert.deepEqual(addon.categoryIds.sort(), [categoryB.id, categoryC.id].sort(), 'Categories save');
  });

  test('Review display', async function(assert) {
    let addon = server.create('addon', {
      name: 'fake-addon'
    });

    await visitAddon(addon);

    assert.onCorrectAddonPage(addon);

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
      released: moment().subtract(3, 'months')
    });

    // Newer version without review
    server.create('version', {
      addon: addonWithReview,
      review: null,
      released: moment().subtract(1, 'months')
    });

    review.update('versionId', addonVersion.id);

    await visitAddon(addonWithReview);

    assert.onCorrectAddonPage(addonWithReview);

    let questions = findAll('.test-review-question');
    assert.dom(questions[0]).hasText('Are there meaningful tests? Yes');
    assert.dom(questions[1]).hasText('Is the README filled out? Unknown');
    assert.dom(questions[2]).hasText('Does the addon have a build? Yes');

    assert.dom('.test-review-notes').hasText('Seems ok');
    assert.dom('.test-review-new-version-warning').hasText('New versions of this addon have been released since this review was undertaken.');
  });

  test('When saving fails', async function(assert) {
    let actualMessage;

    window.alert = function(message) {
      actualMessage = message;
    };

    let addon = server.create('addon', {
      name: 'fake-addon'
    });

    server.patch('/addons/:id', function() {
      return new Mirage.Response(500);
    });

    await visitAddon(addon);

    assert.onCorrectAddonPage(addon);

    await fillIn('.test-note-input', 'Air and water');
    await click('.test-save-addon');

    assert.equal(actualMessage, 'Failed to save addon');
  });

  test('Renewing a review', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon-with-review'
    });

    let review = server.create('review', {
      addonId: addon.id,
      hasTests: 1,
      hasReadme: 4,
      hasBuild: 1,
      review: 'Seems ok'
    });

    addon.latestReview = review;
    addon.save();

    let addonVersion = server.create('version', {
      addon: addon,
      review,
      released: moment().subtract(3, 'months')
    });

    // Newer version without review
    let newestAddonVersion = server.create('version', {
      addon: addon,
      review: null,
      released: moment().subtract(1, 'months')
    });

    review.update('versionId', addonVersion.id);
    addon.update('latestAddonVersionId', newestAddonVersion.id);

    await visitAddon(addon);

    assert.onCorrectAddonPage(addon);
    assert.dom('.test-review-new-version-warning').hasText('New versions of this addon have been released since this review was undertaken.');

    await click('.test-renew-latest-review');

    assert.dom('.test-review-new-version-warning').doesNotExist('Review is now for latest version');

    let newReview = server.schema.reviews.all().models[server.schema.reviews.all().models.length - 1];

    assert.notEqual(newReview.id, review.id);

    newestAddonVersion.reload();
    assert.equal(newestAddonVersion.review.id, newReview.id, 'New review is associated with correct version');

    assert.equal(newReview.version.id, newestAddonVersion.id, 'Review is associated with newest addon version');
    assert.equal(newReview.hasTests, 1);
    assert.equal(newReview.hasReadme, 4);
    assert.equal(newReview.hasBuild, 1);
    assert.equal(newReview.review, 'Seems ok');
  });

  test('When renewing a review fails', async function(assert) {
    let actualMessage;

    window.alert = function(message) {
      actualMessage = message;
    };

    let addon = server.create('addon', {
      name: 'test-addon-with-review'
    });

    let review = server.create('review', {
      addonId: addon.id,
      hasTests: 1,
      hasReadme: 4,
      hasBuild: 1,
      review: 'Seems ok'
    });

    addon.latestReview = review;
    addon.save();

    let addonVersion = server.create('version', {
      addon: addon,
      review,
      released: moment().subtract(3, 'months')
    });

    review.update('versionId', addonVersion.id);
    addon.update('latestAddonVersionId', addonVersion.id);

    server.post('/reviews', function() {
      return new Mirage.Response(500);
    });

    await visitAddon(addon);

    assert.onCorrectAddonPage(addon);

    await click('.test-renew-latest-review');

    assert.equal(actualMessage, 'Failed to renew review');
  });

  test('Creating a new review', async function(assert) {
    let addon = server.create('addon', {
      name: 'test-addon-with-review'
    });

    let addonVersion = server.create('version', {
      addon: addon,
      released: moment().subtract(3, 'months')
    });

    server.create('version', {
      addon: addon,
      released: moment().subtract(6, 'months')
    });

    addon.update('latestAddonVersionId', addonVersion.id);

    await visitAddon(addon);

    assert.onCorrectAddonPage(addon);
    assert.dom('.test-review-new-version-warning').doesNotExist('Review is current');

    await answerQuestion('Are there meaningful tests?', 'No');
    await answerQuestion('Is the README filled out?', 'Yes');
    await answerQuestion('Does the addon have a build?', 'N/A');
    await fillIn('.test-addon-review-notes', '#Some Review');
    await click('.test-addon-review-save');

    assert.dom('.test-review-new-version-warning').doesNotExist('Review is current');

    let newReview = server.schema.reviews.all().models[server.schema.reviews.all().models.length - 1];
    assert.equal(newReview.version.id, addonVersion.id);
    assert.equal(newReview.hasTests, 2);
    assert.equal(newReview.hasReadme, 1);
    assert.equal(newReview.hasBuild, 3);
    assert.equal(newReview.review, '#Some Review');

    let questions = findAll('.test-review-question');
    assert.dom(questions[0]).hasText('Are there meaningful tests? No');
    assert.dom(questions[1]).hasText('Is the README filled out? Yes');
    assert.dom(questions[2]).hasText('Does the addon have a build? N/A');
    assert.dom('.test-review-notes').hasText('Some Review');
  });

  test('When creating a new review fails', async function(assert) {
    let actualMessage;

    window.alert = function(message) {
      actualMessage = message;
    };

    let addon = server.create('addon', {
      name: 'test-addon-with-review'
    });

    let addonVersion = server.create('version', {
      addon: addon,
      released: moment().subtract(3, 'months')
    });

    server.create('version', {
      addon: addon,
      released: moment().subtract(6, 'months')
    });

    addon.update('latestAddonVersionId', addonVersion.id);

    server.post('/reviews', function() {
      return new Mirage.Response(500);
    });

    await visitAddon(addon);

    assert.onCorrectAddonPage(addon);

    await answerQuestion('Are there meaningful tests?', 'Yes');
    await click('.test-addon-review-save');

    assert.equal(actualMessage, 'Failed to create review');
  });

  module('lists', function() {
    test('Visiting list without a list param defaults to needing-review', async function(assert) {
      let addon = server.create('addon', {
        name: 'fake-addon'
      });

      await visit('/admin/review');

      assert.onCorrectAddonPage(addon);
      assert.dom('.test-review-list-item').exists({ count: 1 }, 'Displays list of addons');
    });

    test('Visiting addon without a list param does not show index', async function(assert) {
      let addon = server.create('addon', {
        name: 'fake-addon'
      });

      await visitAddon(addon);

      assert.onCorrectAddonPage(addon);
      assert.dom('.test-review-index').isNotVisible();
    });

    test('Visiting with just a list selects first addon', async function(assert) {
      server.create('addon', {
        name: 'fake-addon-a'
      });

      let hiddenAddon = server.create('addon', {
        name: 'fake-addon-b',
        isHidden: true,
        latestVersionDate: moment().subtract(1, 'day').toISOString()
      });

      server.create('addon', {
        name: 'fake-addon-c'
      });

      server.create('addon', {
        name: 'fake-addon-d',
        isHidden: true,
        latestVersionDate: moment().subtract(4, 'days').toISOString()
      });

      await visitList('hidden');

      assert.dom('.test-review-index').isVisible();
      assert.onCorrectAddonPage(hiddenAddon);

      let items = findAll('.test-review-list-item');
      assert.dom(items[0]).includesText('fake-addon-b');
      assert.dom(items[1]).includesText('fake-addon-d');
      assert.equal(items.length, 2, 'Only two items display');
    });

    test('Displays different list of addons', async function(assert) {
      server.createList('addon', 5, { isHidden: true });

      await visitList('hidden');

      let expectedOptions = [
        'Hidden Addons',
        'Addons needing categorization',
        'Addons needing re-review',
        'Addons needing review',
        'Addons marked WIP',
        'Addons without a repo url set',
        'Addons marked as invalid repo url'
      ];

      await assert.powerSelectOptionsAre('.test-list-select', '.test-list-select-dropdown', expectedOptions);

      assert.dom('.test-addon-count', '5 matching addons');

      await selectChoose('.test-list-select', 'Addons needing re-review');

      assert.dom('.test-addon-count', '0 matching addons');
    });
  });
});

async function visitAddon(addon, queryString = '') {
  await visit(`/admin/review/${addon.name}${queryString}`);
}

async function visitList(listName) {
  await visit(`/admin/review?list=${listName}`);
}

function assertToggleState(assert, selector, options = { checked: false, text: '' }) {
  if (options.checked) {
    assert.dom(`${selector} input`).isChecked();
  } else {
    assert.dom(`${selector} input`).isNotChecked();
  }
  assert.dom(`${selector} label`).hasText(options.text, `has text when checked: ${options.checked}`);
}

async function toggle(selector) {
  await click(`${selector} input`);
}

async function answerQuestion(question, answer) {
  let questionEl = await findByText('.test-review-question', question);
  let answerButton = await findByText(Array.from(questionEl.querySelectorAll('button')), answer);
  await click(answerButton);
}

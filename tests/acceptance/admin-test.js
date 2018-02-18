import { click, fillIn, find, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import $ from 'jquery';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';
import findByText from '../helpers/find-by-text';
import visitAddon from '../helpers/visit-addon';
import login from 'ember-observer/tests/helpers/login';

module('Acceptance: admin', function(hooks) {
  setupEmberObserverTest(hooks);

  test('visiting /admin not logged in', async function(assert) {
    await visit('/admin');

    assert.equal(currentURL(), '/', 'redirects to index');
  });

  test('visiting /admin', async function(assert) {
    assert.expect(2);
    let done = assert.async();

    this.server.post('/authentication/login.json', function(db, request) {
      assert.equal(request.requestBody, 'email=test%40example.com&password=password123');
      done();
      return {
        token: 'abc123'
      };
    });

    await visit('/login');
    await fillIn('.test-email', 'test@example.com');
    await fillIn('.test-password', 'password123');
    await click('.test-log-in');
    await visit('/admin');
    assert.equal(currentURL(), '/admin', 'Does not redirect');
  });

  test('reviewing addons', async function(assert) {
    assert.expect(7);

    let addon = this.server.create('addon', {
      name: 'test-addon'
    });

    let review = this.server.create('review', {
      addonId: addon.id,
      hasTests: 1,
      hasReadme: 4,
      isMoreThanEmptyAddon: 3,
      isOpenSource: 2,
      hasBuild: 1,
      review: 'Seems ok'
    });

    this.server.create('version', {
      addonId: addon.id,
      reviewId: review.id,
      released: window.moment().subtract(3, 'months')
    });

    let latestVersion = this.server.create('version', {
      addonId: addon.id,
      released: window.moment().subtract(1, 'months')
    });

    this.server.create('category', {
      name: 'Category1',
      addonIds: [addon.id]
    });

    await login();

    await visitAddon(addon);
    await click('.test-addon-review-button');
    answerQuestion('Is the source accessible?', 'Yes');
    answerQuestion('Is it more than an empty addon?', 'Yes');
    answerQuestion('Are there meaningful tests?', 'No');
    answerQuestion('Is the README filled out?', 'Yes');
    answerQuestion('Does the addon have a build?', 'N/A');
    await fillIn('.test-addon-review-notes', '#Some Review');
    await click('.test-addon-review-save');

    let newReview = this.server.schema.reviews.all().models[this.server.schema.reviews.all().models.length - 1];
    assert.equal(newReview.version.id, latestVersion.id);
    assert.equal(newReview.hasTests, 2);
    assert.equal(newReview.hasReadme, 1);
    assert.equal(newReview.isMoreThanEmptyAddon, 1);
    assert.equal(newReview.isOpenSource, 1);
    assert.equal(newReview.hasBuild, 3);
    assert.equal(newReview.review, '#Some Review');
  });

  async function answerQuestion(question, answer) {
    await click($(`li .question:contains("${question}") ~ .test-question-buttons button:contains(${answer})`)[0]);
  }

  test('renewing a review', async function(assert) {
    assert.expect(7);

    let addon = this.server.create('addon', {
      name: 'test-addon'
    });

    let review = this.server.create('review', {
      addonId: addon.id,
      hasTests: 1,
      hasReadme: 4,
      isMoreThanEmptyAddon: 3,
      isOpenSource: 2,
      hasBuild: 1,
      review: 'Seems ok'
    });

    this.server.create('version', {
      addonId: addon.id,
      reviewId: review.id,
      released: window.moment().subtract(3, 'months')
    });

    let latestVersion = this.server.create('version', {
      addonId: addon.id,
      released: window.moment().subtract(1, 'months')
    });

    await login();

    await visitAddon(addon);
    await click('.test-renew-latest-review');

    let newReview = this.server.schema.reviews.all().models[this.server.schema.reviews.all().models.length - 1];
    assert.equal(newReview.version.id, latestVersion.id, 'Review should be for the latest version');
    assert.equal(newReview.hasTests, 1);
    assert.equal(newReview.hasReadme, 4);
    assert.equal(newReview.isMoreThanEmptyAddon, 3);
    assert.equal(newReview.isOpenSource, 2);
    assert.equal(newReview.hasBuild, 1);
    assert.equal(newReview.review, 'Seems ok');
  });

  test('updating addons', async function(assert) {
    assert.expect(30);

    let category1 = this.server.create('category', {
      name: 'Category1'
    });

    let category2 = this.server.create('category', {
      name: 'Category2'
    });

    this.server.create('category', {
      name: 'Category3'
    });

    let addon = this.server.create('addon', {
      name: 'test-addon',
      note: '#note',
      isOfficial: true,
      isDeprecated: true
    });

    addon.update({ categoryIds: [category1.id, category2.id] });

    await login();

    await visitAddon(addon);

    assert.dom('.test-addon-info-form').exists();
    assert.dom('.test-note-input').hasValue('#note', 'Should be prepopulated with existing note');
    assert.equal(find('.test-addon-property-list #official').checked, true, 'official should be checked');
    assert.equal(find('.test-addon-property-list #deprecated').checked, true, 'deprecated should be checked');
    assert.equal(find('.test-addon-property-list #cli-dependency').checked, false, 'cli-dependency should NOT be checked');
    assert.equal(find('.test-addon-property-list #wip').checked, false, 'wip should NOT be checked');
    assert.equal(find('.test-addon-property-list #hide').checked, false, 'hide should NOT be checked');
    assert.equal(find('.test-addon-property-list #has-invalid-github-repo').checked, false, 'has-invalid-github-repo should NOT be checked');

    assert.equal(findByText('.test-categories-form label', 'Category1').querySelector('input').checked, true, 'Category 1 is checked');
    assert.equal(findByText('.test-categories-form label', 'Category2').querySelector('input').checked, true, 'Category 2 is checked');
    assert.equal(findByText('.test-categories-form label', 'Category3').querySelector('input').checked, false, 'Category 3 is NOT checked');
    
    await fillIn('.test-note-input', '#New');
    await click('input#official');
    await click('input#wip');
    
    await click(findByText('label', 'Category1').querySelector('input'));
    await click(findByText('label', 'Category3').querySelector('input'));

    assert.dom('.test-note-input').hasValue('#New', 'Should be updated with new note');
    assert.equal(find('.test-addon-property-list #official').checked, false, 'official should NOT be checked');
    assert.equal(find('.test-addon-property-list #deprecated').checked, true, 'deprecated should be checked');
    assert.equal(find('.test-addon-property-list #cli-dependency').checked, false, 'cli-dependency should NOT be checked');
    assert.equal(find('.test-addon-property-list #wip').checked, true, 'wip should be checked');
    assert.equal(find('.test-addon-property-list #hide').checked, false, 'hide should NOT be checked');
    assert.equal(find('.test-addon-property-list #has-invalid-github-repo').checked, false, 'has-invalid-github-repo should NOT be checked');

    assert.equal(findByText('.test-categories-form label', 'Category1').querySelector('input').checked, false, 'Category 1 is NOT checked');
    assert.equal(findByText('.test-categories-form label', 'Category2').querySelector('input').checked, true, 'Category 2 is checked');
    assert.equal(findByText('.test-categories-form label', 'Category3').querySelector('input').checked, true, 'Category 3 is checked');
    
    await click('.test-save-addon-properties');

    addon.reload();

    assert.equal(addon.note, '#New');
    assert.equal(addon.isOfficial, false);
    assert.equal(addon.isDeprecated, true);
    assert.equal(addon.isCliDependency, false);
    assert.equal(addon.isWip, true);
    assert.equal(addon.isHidden, false);
    assert.equal(addon.hasInvalidGithubRepo, false);
    assert.equal(addon.categories.models.length, 2);
    assert.deepEqual(addon.categories.models.mapBy('name'), ['Category2', 'Category3']);
  });
});


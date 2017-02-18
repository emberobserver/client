import { test } from 'qunit';
import moduleForAcceptance from 'ember-addon-review/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance: admin');

test('visiting /admin not logged in', function(assert) {
  visit('/admin');

  andThen(function() {
    assert.equal(currentURL(), '/', 'redirects to index');
  });
});

test('visiting /admin', function(assert) {
  assert.expect(2);
  let done = assert.async();

  server.post('/authentication/login.json', function(db, request) {
    assert.equal(request.requestBody, 'email=test%40example.com&password=password123');
    done();
    return {
      token: 'abc123'
    };
  });

  visit('/login');
  fillIn('.test-email', 'test@example.com');
  fillIn('.test-password', 'password123');
  click('.test-log-in');
  visit('/admin');
  andThen(function() {
    assert.equal(currentURL(), '/admin', 'Does not redirect');
  });
});

test('reviewing addons', function(assert) {
  assert.expect(7);

  let addon = server.create('addon', {
    name: 'test-addon'
  });

  let review = server.create('review', {
    addonId: addon.id,
    hasTests: 1,
    hasReadme: 4,
    isMoreThanEmptyAddon: 3,
    isOpenSource: 2,
    hasBuild: 1,
    review: 'Seems ok'
  });

  server.create('version', {
    addonId: addon.id,
    reviewId: review.id,
    released: window.moment().subtract(3, 'months')
  });

  let latestVersion = server.create('version', {
    addonId: addon.id,
    released: window.moment().subtract(1, 'months')
  });

  server.create('category', {
    name: 'Category1',
    addonIds: [addon.id]
  });

  login();

  visit(`/addons/${addon.name}`);
  click('.test-addon-review-button');
  answerQuestion('Is the source accessible?', 'Yes');
  answerQuestion('Is it more than an empty addon?', 'Yes');
  answerQuestion('Are there meaningful tests?', 'No');
  answerQuestion('Is the README filled out?', 'Yes');
  answerQuestion('Does the addon have a build?', 'N/A');
  fillIn('.test-addon-review-notes', '#Some Review');
  click('.test-addon-review-save');

  andThen(function() {
    let newReview = server.schema.reviews.all().models[server.schema.reviews.all().models.length - 1];
    assert.equal(newReview.version.id, latestVersion.id);
    assert.equal(newReview.hasTests, 2);
    assert.equal(newReview.hasReadme, 1);
    assert.equal(newReview.isMoreThanEmptyAddon, 1);
    assert.equal(newReview.isOpenSource, 1);
    assert.equal(newReview.hasBuild, 3);
    assert.equal(newReview.review, '#Some Review');
  });
});

function answerQuestion(question, answer) {
  click(`li .question:contains("${question}") ~ .test-question-buttons button:contains(${answer})`);
}

test('renewing a review', function(assert) {
  assert.expect(7);

  let addon = server.create('addon', {
    name: 'test-addon'
  });

  let review = server.create('review', {
    addonId: addon.id,
    hasTests: 1,
    hasReadme: 4,
    isMoreThanEmptyAddon: 3,
    isOpenSource: 2,
    hasBuild: 1,
    review: 'Seems ok'
  });

  server.create('version', {
    addonId: addon.id,
    reviewId: review.id,
    released: window.moment().subtract(3, 'months')
  });

  let latestVersion = server.create('version', {
    addonId: addon.id,
    released: window.moment().subtract(1, 'months')
  });

  login();

  visit(`/addons/${addon.name}`);
  click('.test-renew-latest-review');

  andThen(function() {
    let newReview = server.schema.reviews.all().models[server.schema.reviews.all().models.length - 1];
    assert.equal(newReview.version.id, latestVersion.id);
    assert.equal(newReview.hasTests, 1);
    assert.equal(newReview.hasReadme, 4);
    assert.equal(newReview.isMoreThanEmptyAddon, 3);
    assert.equal(newReview.isOpenSource, 2);
    assert.equal(newReview.hasBuild, 1);
    assert.equal(newReview.review, 'Seems ok');
  });
});

test('updating addons', function(assert) {
  assert.expect(31);

  let category1 = server.create('category', {
    name: 'Category1'
  });

  let category2 = server.create('category', {
    name: 'Category2'
  });

  server.create('category', {
    name: 'Category3'
  });

  let addon = server.create('addon', {
    name: 'test-addon',
    note: '#note',
    isOfficial: true,
    isDeprecated: true
  });

  addon.update({ categoryIds: [category1.id, category2.id] });

  login();

  visit(`/addons/${addon.name}`);

  andThen(function() {
    assert.exists('.test-addon-info-form');
    assert.equal(find('.test-note-input').val(), '#note', 'Should be prepopulated with existing note');
    assert.exists('.test-addon-property-list #official:checked');
    assert.exists('.test-addon-property-list #deprecated:checked');
    assert.notExists('.test-addon-property-list #cli-dependency:checked');
    assert.notExists('.test-addon-property-list #wip:checked');
    assert.notExists('.test-addon-property-list #hide:checked');
    assert.notExists('.test-addon-property-list #has-invalid-github-repo:checked');

    assert.exists('.test-categories-form');
    assert.exists('.test-categories-form label:contains(Category1) input:checked');
    assert.exists('.test-categories-form label:contains(Category2) input:checked');
    assert.notExists('.test-categories-form label:contains(Category3) input:checked');
  });

  fillIn('.test-note-input', '#New');
  click('input#official');
  click('input#wip');
  click('label:contains(Category1) input');
  click('label:contains(Category3) input');

  andThen(function() {
    assert.equal(find('.test-note-input').val(), '#New', 'Should be updated with new note');
    assert.notExists('.test-addon-property-list #official:checked');
    assert.exists('.test-addon-property-list #deprecated:checked');
    assert.notExists('.test-addon-property-list #cli-dependency:checked');
    assert.exists('.test-addon-property-list #wip:checked');
    assert.notExists('.test-addon-property-list #hide:checked');
    assert.notExists('.test-addon-property-list #has-invalid-github-repo:checked');

    assert.notExists('.test-categories-form label:contains(Category1) input:checked');
    assert.exists('.test-categories-form label:contains(Category2) input:checked');
    assert.exists('.test-categories-form label:contains(Category3) input:checked');
  });

  click('.test-save-addon-properties');

  andThen(function() {
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

function login() {
  server.post('/authentication/login.json', function() {
    return {
      token: 'abc123'
    };
  });
  visit('/login');
  fillIn('.test-email', 'test@example.com');
  fillIn('.test-password', 'password123');
  click('.test-log-in');
}

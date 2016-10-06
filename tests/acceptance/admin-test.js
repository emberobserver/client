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
  var done = assert.async();

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

  var addon = server.create('addon', {
    name: 'test-addon'
  });

  var review = server.create('review', {
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

  var latestVersion = server.create('version', {
    addonId: addon.id,
    released: window.moment().subtract(1, 'months')
  });

  server.create('category', {
    name: 'Category1',
    addonIds: [addon.id]
  });

  server.post('/reviews', function(db, request) {
    var data = JSON.parse(request.requestBody).review;
    assert.equal(data.review, '#Some Review');
    assert.equal(data.version_id, latestVersion.id);
    assert.equal(data.has_build, 3);
    assert.equal(data.has_readme, 1);
    assert.equal(data.has_tests, 2);
    assert.equal(data.is_more_than_empty_addon, 1);
    assert.equal(data.is_open_source, 1);
    let review = server.create('review', data);
    return { review: review };
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
});

function answerQuestion(question, answer) {
  click(`li .question:contains("${question}") ~ .test-question-buttons button:contains(${answer})`);
}

test('renewing a review', function(assert) {
  assert.expect(7);

  var addon = server.create('addon', {
    name: 'test-addon'
  });

  var review = server.create('review', {
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

  var latestVersion = server.create('version', {
    addonId: addon.id,
    released: window.moment().subtract(1, 'months')
  });

  server.post('/reviews', function(db, request) {
    var data = JSON.parse(request.requestBody).review;
    assert.equal(data.version_id, latestVersion.id);
    assert.equal(data.has_tests, 1);
    assert.equal(data.has_readme, 4);
    assert.equal(data.is_more_than_empty_addon, 3);
    assert.equal(data.is_open_source, 2);
    assert.equal(data.has_build, 1);
    assert.equal(data.review, 'Seems ok');
    let review = server.create('review', data);
    return { review: review };
  });

  login();

  visit(`/addons/${addon.name}`);
  click('.test-renew-latest-review');
});

test('updating addons', function(assert) {
  assert.expect(32);

  var addon = server.create('addon', {
    name: 'test-addon',
    note: '#note',
    isOfficial: true,
    isDeprecated: true
  });
  server.create('category', {
    name: 'Category1',
    addonIds: [addon.id]
  });
  var category2 = server.create('category', {
    name: 'Category2',
    addonIds: [addon.id]
  });
  var category3 = server.create('category', {
    name: 'Category3',
    addonIds: []
  });

  server.put('/addons/1', function(db, request) {
    var data = JSON.parse(request.requestBody).addon;

    assert.equal(data.note, '#New');
    assert.equal(data.is_official, false);
    assert.equal(data.is_deprecated, true);
    assert.equal(data.is_cli_dependency, false);
    assert.equal(data.is_wip, true);
    assert.equal(data.is_hidden, false);
    assert.equal(data.has_invalid_github_repo, false);
    assert.equal(data.categories.length, 2);
    assert.ok(data.categories.indexOf(category2.id.toString()) >= 0);
    assert.ok(data.categories.indexOf(category3.id.toString()) >= 0);
  });

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

import { test } from 'qunit';
import moduleForAcceptance from 'ember-addon-review/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | managing build servers');

test('not-logged-in users cannot see list of build servers', function(assert) {
  visit('/admin/build-servers');

  andThen(function() {
    assert.equal(currentURL(), '/', 'not-logged-in users are redirected back to index page');
  });
});

test('index page lists all build servers', function(assert) {
  server.createList('build_server', 15);

  login();
  visit('/admin/build-servers');

  andThen(function() {
    assert.exists('.test-build-server-row', 15);
  });
});

test('adding a new build server', function(assert) {
  assert.expect(2);

  server.post('/build_servers', function(db, request) {
    let requestBody = JSON.parse(request.requestBody);
    assert.equal(requestBody.build_server.name, 'new-server-name', 'makes the correct HTTP call');
  });

  login();
  visit('/admin/build-servers');

  fillIn('.test-new-build-server-name', 'new-server-name');
  click('.test-add-new-build-server');

  andThen(function() {
    assert.exists('.test-build-server-row:contains(new-server-name)', 'displays a row for the newly-created build server');
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

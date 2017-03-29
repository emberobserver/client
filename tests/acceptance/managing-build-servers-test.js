import { test } from 'qunit';
import moduleForAcceptance from 'ember-addon-review/tests/helpers/module-for-acceptance';
import login from 'ember-addon-review/tests/helpers/login';

moduleForAcceptance('Acceptance | managing build servers');

test('not-logged-in users cannot see list of build servers', function(assert) {
  visit('/admin/build-servers');

  andThen(function() {
    assert.equal(currentURL(), '/', 'not-logged-in users are redirected back to index page');
  });
});

test('index page lists all build servers', function(assert) {
  server.createList('buildServer', 15);

  login();
  visit('/admin/build-servers');

  andThen(function() {
    assert.exists('.test-build-server-row', 15);
  });
});

test('adding a new build server', function(assert) {
  assert.expect(2);

  server.post('/build-servers', function(schema, request) {
    let requestBody = JSON.parse(request.requestBody);
    assert.equal(requestBody.data.attributes.name, 'new-server-name', 'makes the correct HTTP call');
    return server.create('buildServer', this.normalizedRequestAttrs());
  });

  login();
  visit('/admin/build-servers');

  fillIn('.test-new-build-server-name', 'new-server-name');
  click('.test-add-new-build-server');

  andThen(function() {
    assert.exists('.test-build-server-row:contains(new-server-name)', 'displays a row for the newly-created build server');
  });
});

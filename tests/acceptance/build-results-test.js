import { test } from 'qunit';
import moduleForAcceptance from 'ember-addon-review/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | build results');

test('displays basic info about a build', function(assert) {
  let addon = server.create('addon');
  let addonVersion = server.create('version', { addon_id: addon.id });
  server.create('test_result', {
    version_id: addonVersion.id,
    tests_run_at: moment('2016-08-07 16:30').utc()
  });

  login();
  visit('/admin/build-results');

  andThen(function() {
    assert.equal(currentRouteName(), 'admin.build-results');
    assert.containsExactly('.test-build-result td:eq(0)', addon.name, 'displays addon name');
    assert.containsExactly('.test-build-result td:eq(1)', '1.0.0', 'displays addon version');
    assert.containsExactly('.test-build-result td:eq(2)', '2016-08-07 16:30', 'displays date/time');
  });
});

test('displays appropriate status based on result', function(assert) {

});

test('sorts results by run date', function(assert) {

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

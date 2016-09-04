import { test } from 'qunit';
import moduleForAcceptance from 'ember-addon-review/tests/helpers/module-for-acceptance';
import moment from 'moment';

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
    assert.equal(currentRouteName(), 'admin.build-results.index');
    assert.containsExactly('.test-build-result td:eq(0)', addon.name, 'displays addon name');
    assert.containsExactly('.test-build-result td:eq(1)', '1.0.0', 'displays addon version');
    assert.containsExactly('.test-build-result td:eq(2)', '2016-08-07 16:30', 'displays date/time');
  });
});

test('sorts results by run date', function(assert) {
  let addon = server.create('addon');
  let addonVersion = server.create('version', { addon_id: addon.id });
  let middleTestResult = server.create('test_result', {
    vesion_id: addonVersion.id,
    tests_run_at: moment().subtract(6, 'hours').utc()
  });
  let earliestTestResult = server.create('test_result', {
    version_id: addonVersion.id,
    tests_run_at: moment().subtract(12, 'hours').utc()
  });
  let latestTestResult = server.create('test_result', {
    version_id: addonVersion.id,
    tests_run_at: moment().utc()
  });

  login();
  visit('/admin/build-results');

  andThen(function() {
    assert.equal(find('.test-build-result:eq(0)').attr('data-testResultId'), `${latestTestResult.id}`);
    assert.equal(find('.test-build-result:eq(1)').attr('data-testResultId'), `${middleTestResult.id}`);
    assert.equal(find('.test-build-result:eq(2)').attr('data-testResultId'), `${earliestTestResult.id}`);
  });
});

test('displays appropriate status based on result', function(assert) {
  let addon = server.create('addon');
  let addonVersion = server.create('version', { addon_id: addon.id });
  server.create('test_result', {
    version_id: addonVersion.id,
    succeeded: false,
    status_message: 'timed out',
    tests_run_at: moment().subtract(30, 'minutes').utc()
  });
  server.create('test_result', {
    version_id: addonVersion.id,
    succeeded: true,
    tests_run_at: moment().subtract(1, 'hour').utc()
  });

  login();
  visit('/admin/build-results');

  andThen(function() {
    assert.contains('.test-build-result:eq(0) td:eq(3)', 'failed - timed out', 'displays failure notice with status message for failed builds');
    assert.contains('.test-build-result:eq(1) td:eq(3)', 'succeeded', 'displays "succeeded" for successful builds');
  });
});

test('links to detail for individual builds', function(assert) {
  let version = server.create('version');
  let testResult = server.create('test_result', { version_id: version.id });

  login();
  visit('/admin/build-results');
  click('.test-build-result a:contains(details)');

  andThen(function() {
    assert.equal(currentURL(), `/admin/build-results/${testResult.id}`);
  });
});

test('detail page shows data for a build', function(assert) {
  let addon = server.create('addon');
  let version = server.create('version', {
    addon_id: addon.id
  });
  let testResult = server.create('test_result', {
    version_id: version.id,
    output: 'this is the output',
    tests_run_at: moment('2016-08-01 12:34:56').utc()
  });
  server.db.versions.update(version, { test_result_id: testResult.id });

  login();
  visit(`/admin/build-results/${testResult.id}`);

  andThen(function() {
    assert.contains('.test-addon-name', addon.name, 'displays addon name');
    assert.contains('.test-addon-version', version.version, 'displays addon version');
    assert.contains('.test-run-date', '2016-08-01 12:34', 'displays date/time tests ran');
    assert.contains('.test-output', 'this is the output', "displays result's output");
  });
});

test('detail page shows "succeeded" for status when build succeeded', function(assert) {
  let version = server.create('version');
  let testResult = server.create('test_result', {
    version_id: version.id,
    succeeded: true
  });
  server.db.versions.update(version, { test_result_id: testResult.id });

  login();
  visit(`/admin/build-results/${testResult.id}`);

  andThen(function() {
    assert.contains('.test-build-status', 'succeeded', 'displays "succeeded" for build status');
  });
});

test('detail page shows status message when build did not succeeded', function(assert) {
  let version = server.create('version');
  let testResult = server.create('test_result', {
    version_id: version.id,
    succeeded: false,
    status_message: 'this is the status'
  });
  server.db.versions.update(version, { test_result_id: testResult.id });

  login();
  visit(`/admin/build-results/${testResult.id}`);

  andThen(function() {
    assert.contains('.test-build-status', 'this is the status', 'displays status message for the build');
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

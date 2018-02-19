import { find, findAll, click, currentURL, currentRouteName, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';
import moment from 'moment';
import login from 'ember-observer/tests/helpers/login';

module('Acceptance | build results', function(hooks) {
  setupEmberObserverTest(hooks);

  test('displays basic info about a build', async function(assert) {
    let addon = server.create('addon');
    let addonVersion = server.create('version', { addonId: addon.id });
    server.create('testResult', {
      versionId: addonVersion.id,
      createdAt: moment('2016-08-07 16:30').utc()
    });

    await login();
    await visit('/admin/build-results');

    assert.equal(currentRouteName(), 'admin.build-results.index');
    assert.containsExactly('.test-build-result td:eq(0)', addon.name, 'displays addon name');
    assert.containsExactly('.test-build-result td:eq(1)', '1.0.0', 'displays addon version');
    assert.containsExactly('.test-build-result td:eq(2)', '2016-08-07 16:30', 'displays date/time');
  });

  test('sorts results by run date', async function(assert) {
    let addon = server.create('addon');
    let addonVersion = server.create('version', { addonId: addon.id });
    let middleTestResult = server.create('testResult', {
      createdAt: moment('2016-11-19 12:00:00').utc()
    });
    let earliestTestResult = server.create('testResult', {
      createdAt: moment('2016-11-19 00:00:01').utc()
    });
    let latestTestResult = server.create('testResult', {
      createdAt: moment('2016-11-19 23:59:59').utc()
    });
    addonVersion.update({
      testResultIds: [middleTestResult.id, earliestTestResult.id, latestTestResult.id]
    });

    await login();
    await visit('/admin/build-results');

    assert.equal(find('.test-build-result').getAttribute('data-testResultId'), `${latestTestResult.id}`);
    assert.equal(find(findAll('.test-build-result')[1]).getAttribute('data-testResultId'), `${middleTestResult.id}`);
    assert.equal(find(findAll('.test-build-result')[2]).getAttribute('data-testResultId'), `${earliestTestResult.id}`);
  });

  test('displays appropriate status based on result', async function(assert) {
    let addon = server.create('addon');
    let addonVersion = server.create('version', { addonId: addon.id });
    let timedOutResult = server.create('testResult', {
      succeeded: false,
      statusMessage: 'timed out',
      createdAt: moment().subtract(30, 'minutes').utc()
    });
    let succeededResult = server.create('testResult', {
      succeeded: true,
      createdAt: moment().subtract(1, 'hour').utc()
    });
    addonVersion.update({
      testResultIds: [timedOutResult.id, succeededResult.id]
    });

    await login();
    await visit('/admin/build-results');

    assert.contains('.test-build-result:eq(0) td:eq(3)', 'failed - timed out', 'displays failure notice with status message for failed builds');
    assert.contains('.test-build-result:eq(1) td:eq(3)', 'succeeded', 'displays "succeeded" for successful builds');
  });

  test('displays semver string for non-canary builds', async function(assert) {
    let addon = server.create('addon');
    let addonVersion = server.create('version', { addonId: addon.id });
    server.create('testResult', {
      versionId: addonVersion.id,
      canary: false,
      semverString: '>= 2.0.0',
      createdAt: moment('2016-08-07 16:30').utc()
    });

    await login();
    await visit('/admin/build-results');

    assert.containsExactly('.test-build-result td:eq(4)', '>= 2.0.0', 'displays semver string');

    await click('.test-build-result a:contains(details)');
    assert.containsExactly('.test-semver-string', '>= 2.0.0', 'displays semver string');
  });

  test('displays appropriate indication for canary builds', async function(assert) {
    let addon = server.create('addon');
    let addonVersion = server.create('version', { addonId: addon.id });
    server.create('testResult', {
      versionId: addonVersion.id,
      canary: true,
      createdAt: moment('2016-08-07 16:30').utc()
    });

    await login();
    await visit('/admin/build-results');

    assert.containsExactly('.test-build-result td:eq(4)', 'canary', 'displays indication for canary builds on list');

    await click('.test-build-result a:contains(details)');
    assert.containsExactly('.test-semver-string', 'canary', 'displays indication for canary builds in detail');
  });

  test('links to previous day', async function(assert) {
    await login();
    await visit('/admin/build-results?date=2017-02-01');

    assert.exists('a[href="/admin/build-results?date=2017-01-31"]', 'has a link to the results for the previous day');
  });

  test('links to following day if not viewing the current date', async function(assert) {
    await login();
    await visit('/admin/build-results?date=2016-11-18');

    assert.exists('a[href="/admin/build-results?date=2016-11-19"]', 'has a link to the results for the following day');
  });

  test('does not link to following day if viewing the current date', async function(assert) {
    let tomorrow = moment().add(1, 'day').utc().format('Y-M-D');

    await login();
    await visit('/admin/build-results');

    assert.notExists(`a[href="/admin/build-results?date=${tomorrow}"]`, 'does not have a link to the results for the following day');
  });

  test('links to detail for individual builds', async function(assert) {
    let version = server.create('version');
    let testResult = server.create('testResult', { versionId: version.id });

    await login();
    await visit('/admin/build-results');
    await click('.test-build-result a:contains(details)');

    assert.equal(currentURL(), `/admin/build-results/${testResult.id}`);
  });

  test('detail page shows data for a build', async function(assert) {
    let addon = server.create('addon');
    let version = server.create('version', {
      addonId: addon.id
    });
    let testResult = server.create('testResult', {
      versionId: version.id,
      output: 'this is the output',
      createdAt: moment('2016-08-01 12:34:56').utc()
    });
    server.db.versions.update(version, { testResultId: testResult.id });

    await login();
    await visit(`/admin/build-results/${testResult.id}`);

    assert.contains('.test-addon-name', addon.name, 'displays addon name');
    assert.contains('.test-addon-version', version.version, 'displays addon version');
    assert.contains('.test-run-date', '2016-08-01 12:34', 'displays date/time tests ran');
    assert.contains('.test-output', 'this is the output', "displays result's output");
  });

  test('detail page shows "succeeded" for status when build succeeded', async function(assert) {
    let version = server.create('version');
    let testResult = server.create('testResult', {
      versionId: version.id,
      succeeded: true
    });
    server.db.versions.update(version, { testResultId: testResult.id });

    await login();
    await visit(`/admin/build-results/${testResult.id}`);

    assert.contains('.test-build-status', 'succeeded', 'displays "succeeded" for build status');
  });

  test('detail page shows status message when build did not succeeded', async function(assert) {
    let version = server.create('version');
    let testResult = server.create('testResult', {
      versionId: version.id,
      succeeded: false,
      statusMessage: 'this is the status'
    });
    server.db.versions.update(version, { testResultId: testResult.id });

    await login();
    await visit(`/admin/build-results/${testResult.id}`);

    assert.contains('.test-build-status', 'this is the status', 'displays status message for the build');
  });

  test('detail page has a "retry" button for failed builds', async function(assert) {
    assert.expect(2);

    let version = server.create('version');
    let testResult = server.create('testResult', {
      versionId: version.id,
      succeeded: false,
      statusMessage: 'failed'
    });
    server.db.versions.update(version, { testResultId: testResult.id });

    server.post('/test_results/:id/retry', function() {
      assert.ok(true, 'makes retry request');
    });

    await login();
    await visit(`/admin/build-results/${testResult.id}`);

    assert.exists('.test-retry-build', '"retry" button exists');

    await click('.test-retry-build');
  });

  test('detail page does not have a "retry" button for successful builds', async function(assert) {
    let version = server.create('version');
    let testResult = server.create('testResult', {
      versionId: version.id,
      succeeded: true
    });
    server.db.versions.update(version, { testResultId: testResult.id });

    await login();
    await visit(`/admin/build-results/${testResult.id}`);

    assert.notExists('.test-retry-build', 'no "retry" button should be displayed');
  });
});

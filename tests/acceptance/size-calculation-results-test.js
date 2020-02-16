import { findAll, click, currentURL, currentRouteName, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { percySnapshot } from 'ember-percy';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';
import findByText from '../helpers/find-by-text';
import login from 'ember-observer/tests/helpers/login';
import moment from 'moment';

module('Acceptance | size calculation results', function(hooks) {
  setupEmberObserverTest(hooks);

  test('displays basic info about a build', async function(assert) {
    let addon = server.create('addon');
    let addonVersion = server.create('version', { addonId: addon.id });
    server.create('sizeCalculationResult', {
      versionId: addonVersion.id,
      createdAt: moment('2016-08-07 16:30').utc()
    });

    await login();
    await visit('/admin/size-calculation-results');

    assert.equal(currentRouteName(), 'admin.size-calculation-results.index');
    let results = findAll('.test-size-calculation-result td');
    assert.dom(results[0]).hasText(addon.name, 'displays addon name');
    assert.dom(results[1]).hasText('1.0.0', 'displays addon version');
    assert.dom(results[2]).hasText('2016-08-07 16:30', 'displays date/time');
  });

  test('sorts results by run date', async function(assert) {
    let addon = server.create('addon');
    let addonVersion = server.create('version', { addonId: addon.id });
    let middleTestResult = server.create('sizeCalculationResult', {
      createdAt: moment('2016-11-19 12:00:00').utc()
    });
    let earliestTestResult = server.create('sizeCalculationResult', {
      createdAt: moment('2016-11-19 00:00:01').utc()
    });
    let latestTestResult = server.create('sizeCalculationResult', {
      createdAt: moment('2016-11-19 23:59:59').utc()
    });
    addonVersion.update({
      sizeCalculationResultIds: [middleTestResult.id, earliestTestResult.id, latestTestResult.id]
    });

    await login();
    await visit('/admin/size-calculation-results');

    assert.dom('.test-size-calculation-result').hasAttribute('data-sizeCalculationResultId', `${latestTestResult.id}`);

    let results = findAll('.test-size-calculation-result');
    assert.dom(results[1]).hasAttribute('data-sizeCalculationResultId', `${middleTestResult.id}`);
    assert.dom(results[2]).hasAttribute('data-sizeCalculationResultId', `${earliestTestResult.id}`);
  });

  test('displays appropriate status based on result', async function(assert) {
    let addon = server.create('addon');
    let addonVersion = server.create('version', { addonId: addon.id });
    let timedOutResult = server.create('sizeCalculationResult', {
      succeeded: false,
      errorMessage: 'something unexpected happened',
      createdAt: moment().subtract(30, 'minutes').utc()
    });
    let succeededResult = server.create('sizeCalculationResult', {
      succeeded: true,
      createdAt: moment().subtract(1, 'hour').utc()
    });
    addonVersion.update({
      sizeCalculationResultIds: [timedOutResult.id, succeededResult.id]
    });

    await login();
    await visit('/admin/size-calculation-results');

    let results = findAll('.test-size-calculation-result');
    assert.dom(results[0]).containsText('failed - something unexpected happened', 'displays failure notice with error message for failed builds');
    assert.dom(results[1]).containsText('succeeded', 'displays "succeeded" for successful builds');
  });

  test('links to previous day', async function(assert) {
    await login();
    await visit('/admin/size-calculation-results?date=2017-02-01');

    assert.dom('a[href="/admin/size-calculation-results?date=2017-01-31"]').exists('has a link to the results for the previous day');
  });

  test('links to following day if not viewing the current date', async function(assert) {
    await login();
    await visit('/admin/size-calculation-results?date=2016-11-18');

    assert.dom('a[href="/admin/size-calculation-results?date=2016-11-19"]').exists('has a link to the results for the following day');
  });

  test('does not link to following day if viewing the current date', async function(assert) {
    let tomorrow = moment().add(1, 'day').utc().format('Y-M-D');

    await login();
    await visit('/admin/size-calculation-results');

    assert.dom(`a[href="/admin/size-calculation-results?date=${tomorrow}"]`).doesNotExist('does not have a link to the results for the following day');
  });

  test('links to detail for individual builds', async function(assert) {
    let version = server.create('version');
    let output = [
      {
        group: 'this is the output',
        commands: [],
      }
    ];
    let testResult = server.create('sizeCalculationResult', {
      versionId: version.id,
      output: JSON.stringify(output),
    });

    await login();
    await visit('/admin/size-calculation-results');
    await click(findByText('.test-size-calculation-result a', 'details'));

    await percySnapshot('/admin/size-calculation-results');

    assert.equal(currentURL(), `/admin/size-calculation-results/${testResult.id}`);
  });

  test('detail page shows data for a build', async function(assert) {
    let addon = server.create('addon');
    let version = server.create('version', {
      addonId: addon.id
    });
    let output = [
      {
        group: 'this is the output',
        commands: [],
      }
    ];
    let testResult = server.create('sizeCalculationResult', {
      versionId: version.id,
      output: JSON.stringify(output),
      createdAt: moment('2016-08-01 12:34:56').utc()
    });
    server.db.versions.update(version, { testResultId: testResult.id });

    await login();
    await visit(`/admin/size-calculation-results/${testResult.id}`);

    assert.dom('.test-addon-name').hasText(addon.name, 'displays addon name');
    assert.dom('.test-addon-version').hasText(version.version, 'displays addon version');
    assert.dom('.test-run-date').hasText('2016-08-01 12:34', 'displays date/time tests ran');
    assert.dom('.build-result-output').hasText('this is the output', "displays result's output as json");
  });

  test('detail page shows "succeeded" for status when build succeeded', async function(assert) {
    let version = server.create('version');
    let testResult = server.create('sizeCalculationResult', {
      versionId: version.id,
      succeeded: true
    });
    server.db.versions.update(version, { testResultId: testResult.id });

    await login();
    await visit(`/admin/size-calculation-results/${testResult.id}`);

    assert.dom('.test-build-status').hasText('succeeded', 'displays "succeeded" for build status');
  });

  test('detail page shows status message when build did not succeeded', async function(assert) {
    let version = server.create('version');
    let testResult = server.create('sizeCalculationResult', {
      versionId: version.id,
      succeeded: false,
      errorMessage: 'this is the status'
    });
    server.db.versions.update(version, { testResultId: testResult.id });

    await login();
    await visit(`/admin/size-calculation-results/${testResult.id}`);

    assert.dom('.test-build-status').hasText('this is the status', 'displays status message for the build');
  });

  test('detail page has a "retry" button for failed builds', async function(assert) {
    assert.expect(2);

    let version = server.create('version');
    let testResult = server.create('sizeCalculationResult', {
      versionId: version.id,
      succeeded: false,
      errorMessage: 'failed'
    });
    server.db.versions.update(version, { testResultId: testResult.id });

    server.post('/size_calculation_results/:id/retry', function() {
      assert.ok(true, 'makes retry request');
    });

    await login();
    await visit(`/admin/size-calculation-results/${testResult.id}`);

    assert.dom('.test-retry-build').exists('"retry" button exists');

    await click('.test-retry-build');
  });

  test('detail page does not have a "retry" button for successful builds', async function(assert) {
    let version = server.create('version');
    let testResult = server.create('sizeCalculationResult', {
      versionId: version.id,
      succeeded: true
    });
    server.db.versions.update(version, { testResultId: testResult.id });

    await login();
    await visit(`/admin/size-calculation-results/${testResult.id}`);

    assert.dom('.test-retry-build').doesNotExist('no "retry" button should be displayed');
  });
});

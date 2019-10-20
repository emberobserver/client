import { findAll, click, currentURL, currentRouteName, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { percySnapshot } from 'ember-percy';
import { setupEmberObserverTest } from '../helpers/setup-ember-observer-test';
import emberTryScenario from 'ember-observer/tests/helpers/ember-try-scenario';
import findByText from '../helpers/find-by-text';
import login from 'ember-observer/tests/helpers/login';
import moment from 'moment';

module('Acceptance | build results', function(hooks) {
  setupEmberObserverTest(hooks);

  module('Index', function() {
    test('displays basic info about a build', async function(assert) {
      let addon = server.create('addon');
      let addonVersion = server.create('version', { addon });
      server.create('testResult', {
        version: addonVersion,
        createdAt: moment('2016-08-07 16:30').utc()
      });

      await login();
      await visit('/admin/build-results');

      assert.equal(currentRouteName(), 'admin.build-results.index');
      let results = findAll('.test-build-result td');
      assert.dom(results[0]).hasText(addon.name, 'displays addon name');
      assert.dom(results[1]).hasText('1.0.0', 'displays addon version');
      assert.dom(results[2]).hasText('2016-08-07 16:30', 'displays date/time');
    });

    test('sorts results by run date', async function(assert) {
      let addon = server.create('addon');
      let addonVersion = server.create('version', { addon });
      let middleTestResult = server.create('testResult', {
        version: addonVersion,
        createdAt: moment('2016-11-19 12:00:00').utc()
      });
      let earliestTestResult = server.create('testResult', {
        version: addonVersion,
        createdAt: moment('2016-11-19 00:00:01').utc()
      });
      let latestTestResult = server.create('testResult', {
        version: addonVersion,
        createdAt: moment('2016-11-19 23:59:59').utc()
      });

      await login();
      await visit('/admin/build-results');

      assert.dom('.test-build-result').hasAttribute('data-testResultId', `${latestTestResult.id}`);

      let results = findAll('.test-build-result');
      assert.dom(results[1]).hasAttribute('data-testResultId', `${middleTestResult.id}`);
      assert.dom(results[2]).hasAttribute('data-testResultId', `${earliestTestResult.id}`);
    });

    test('displays appropriate status based on result', async function(assert) {
      let addon = server.create('addon');
      let addonVersion = server.create('version', { addon });
      server.create('testResult', {
        version: addonVersion,
        succeeded: false,
        statusMessage: 'timed out',
        createdAt: moment().subtract(30, 'minutes').utc()
      });
      server.create('testResult', {
        version: addonVersion,
        succeeded: true,
        createdAt: moment().subtract(1, 'hour').utc()
      });

      await login();
      await visit('/admin/build-results');

      let results = findAll('.test-build-result');
      assert.dom(results[0]).containsText('failed - timed out', 'displays failure notice with status message for failed builds');
      assert.dom(results[1]).containsText('succeeded', 'displays "succeeded" for successful builds');
    });

    test('displays semver string for non-canary builds', async function(assert) {
      let addon = server.create('addon');
      let addonVersion = server.create('version', { addon });
      server.create('testResult', {
        version: addonVersion,
        canary: false,
        semverString: '>= 2.0.0',
        createdAt: moment('2016-08-07 16:30').utc()
      });

      await login();
      await visit('/admin/build-results');

      assert.dom('.test-build-result').containsText('>= 2.0.0', 'displays semver string');

      await click(findByText('.test-build-result a', 'details'));

      assert.dom('.test-semver-string').hasText('>= 2.0.0', 'displays semver string');
    });

    test('displays appropriate indication for canary builds', async function(assert) {
      let addon = server.create('addon');
      let addonVersion = server.create('version', { addon });
      server.create('testResult', {
        version: addonVersion,
        canary: true,
        createdAt: moment('2016-08-07 16:30').utc()
      });

      await login();
      await visit('/admin/build-results');

      assert.dom('.test-build-result').containsText('canary', 'displays indication for canary builds on list');

      await click(findByText('.test-build-result a', 'details'));
      assert.dom('.test-semver-string').hasText('canary', 'displays indication for canary builds in detail');
    });

    test('links to previous day', async function(assert) {
      await login();
      await visit('/admin/build-results?date=2017-02-01');

      assert.dom('a[href="/admin/build-results?date=2017-01-31"]').exists('has a link to the results for the previous day');
    });

    test('links to following day if not viewing the current date', async function(assert) {
      await login();
      await visit('/admin/build-results?date=2016-11-18');

      assert.dom('a[href="/admin/build-results?date=2016-11-19"]').exists('has a link to the results for the following day');
    });

    test('does not link to following day if viewing the current date', async function(assert) {
      let tomorrow = moment().add(1, 'day').utc().format('Y-M-D');

      await login();
      await visit('/admin/build-results');

      assert.dom(`a[href="/admin/build-results?date=${tomorrow}"]`).doesNotExist('does not have a link to the results for the following day');
    });

    test('links to detail for individual builds', async function(assert) {
      let version = server.create('version');
      let testResult = server.create('testResult', { version });

      await login();
      await visit('/admin/build-results');
      await click(findByText('.test-build-result a', 'details'));

      await percySnapshot('/admin/build-results');

      assert.equal(currentURL(), `/admin/build-results/${testResult.id}`);
    });
  });

  module('Individual build detail', function() {
    test('detail page shows data for a build', async function(assert) {
      let addon = server.create('addon');
      let version = server.create('version', {
        addon
      });
      let testResult = server.create('testResult', {
        version,
        output: 'this is the output',
        createdAt: moment('2016-08-01 12:34:56').utc()
      });

      await login();
      await visit(`/admin/build-results/${testResult.id}`);

      assert.dom('.test-addon-name').hasText(addon.name, 'displays addon name');
      assert.dom('.test-addon-version').hasText(version.version, 'displays addon version');
      assert.dom('.test-run-date').hasText('2016-08-01 12:34', 'displays date/time tests ran');
      assert.dom('.test-output').hasText('this is the output', "displays result's output");
    });

    test('detail page shows "succeeded" for status when build succeeded', async function(assert) {
      let version = server.create('version');
      let testResult = server.create('testResult', {
        version,
        succeeded: true
      });

      await login();
      await visit(`/admin/build-results/${testResult.id}`);

      assert.dom('.test-build-status').hasText('succeeded', 'displays "succeeded" for build status');
    });

    test('detail page shows status message when build did not succeeded', async function(assert) {
      let version = server.create('version');
      let testResult = server.create('testResult', {
        version,
        succeeded: false,
        statusMessage: 'this is the status'
      });

      await login();
      await visit(`/admin/build-results/${testResult.id}`);

      assert.dom('.test-build-status').hasText('this is the status', 'displays status message for the build');
    });

    test('detail page has a "retry" button for failed builds', async function(assert) {
      assert.expect(3);

      let version = server.create('version');
      let testResult = server.create('testResult', {
        version,
        succeeded: false,
        statusMessage: 'failed'
      });

      server.post('/test_results/:id/retry', function() {
        assert.ok(true, 'makes retry request');
      });

      await login();
      await visit(`/admin/build-results/${testResult.id}`);

      assert.dom('.test-retry-build').exists('"retry" button exists');

      await click('.test-retry-build');

      assert.dom('.test-retry-build').doesNotExist('"retry" button removed after retrying');
    });

    test('detail page does not have a "retry" button for successful builds', async function(assert) {
      let version = server.create('version');
      let testResult = server.create('testResult', {
        version,
        succeeded: true
      });

      await login();
      await visit(`/admin/build-results/${testResult.id}`);

      assert.dom('.test-retry-build').doesNotExist('no "retry" button should be displayed');
    });

    test('when test result has ember-try results, displays a summary table', async function(assert) {
      let testResult = server.create('testResult', {
        version: server.create('version'),
        succeeded: true,
        emberTryResults: {
          scenarios: [
            emberTryScenario('3.4'),
            emberTryScenario('3.8'),
            emberTryScenario('3.12'),
            emberTryScenario('3.13')
          ]
        }
      });

      await visit(`/admin/build-results/${testResult.id}`);

      assert.dom('[data-test-results-table]').exists();
    });

    test('when test result does not have ember-try results, does not display summary table', async function(assert) {
      let testResult = server.create('testResult', {
        version: server.create('version'),
        succeeded: true,
        emberTryResults: null
      });

      await visit(`/admin/build-results/${testResult.id}`);

      assert.dom('[data-test-results-table]').doesNotExist();
    });
  });
});

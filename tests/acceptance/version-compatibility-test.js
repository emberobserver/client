import { test } from 'qunit';
import moduleForAcceptance from 'ember-addon-review/tests/helpers/module-for-acceptance';
import moment from 'moment';

moduleForAcceptance('Acceptance | version compatibility');

test('displays Ember version compatibility when an addon has it', function(assert) {
  server.logging = true;
  let { addon } = createAddonWithVersionCompatibilities([failedVersion('1.13.13'), '2.0.0']);

  visitAddon(addon);

  andThen(function() {
    assert.exists('.test-ember-version-compatibility-list', 'version compatibility list displays');
    assert.contains('.test-ember-version-compatibility-ember-version', '2.0.0');
    assert.contains('.test-ember-version-compatibility-test-result', 'yes');
  });
});

test('sorts version compatibility entries by version number', function(assert) {
  let { addon } = createAddonWithVersionCompatibilities(['2.0.3', '1.13.13', '2.10.0', '2.2.2', failedVersion('1.12.1')]);

  visitAddon(addon);
  andThen(function() {
    assert.containsExactly('.test-ember-version-compatibility-ember-version:eq(0)', '2.10.0');
    assert.containsExactly('.test-ember-version-compatibility-ember-version:eq(1)', '2.2.2');
    assert.containsExactly('.test-ember-version-compatibility-ember-version:eq(2)', '2.0.3');
    assert.containsExactly('.test-ember-version-compatibility-ember-version:eq(3)', '1.13.13');
    assert.containsExactly('.test-ember-version-compatibility-ember-version:eq(4)', '1.12.1');
  });
});

test("displays appropriate text when an addon's test result indicated a failure", function(assert) {
  let addon = server.create('addon');
  let testResult = server.create('testResult', { succeeded: false });
  let version = server.create('version', { addonId: addon.id });
  testResult.update({ versionId: version.id });

  visitAddon(addon);
  andThen(function() {
    assert.exists('.test-ember-version-compatibility-section', 'displays the version compatibility section');
    assert.exists('.test-ember-version-compatibility-unknown', 'displays a message');
  });
});

test('does not display Ember version compatibility when an addon does not have it', function(assert) {
  let addon = server.create('addon');
  server.create('version', { addonId: addon.id });

  visitAddon(addon);
  andThen(() => assert.notExists('.test-ember-version-compatibility-section'));
});

test('hides beta and canary versions from the table', function(assert) {
  let { addon } = createAddonWithVersionCompatibilities([failedVersion('2.3.0'), '2.4.3', '2.5.0-beta.3+7c4288b9', '2.6.0-canary+e35e8b48']);

  visitAddon(addon);
  andThen(function() {
    assert.exists('.test-ember-version-compatibility-ember-version', 2);
    assert.notExists('.test-ember-version-compatibility-ember-version:contains(beta)', 'does not display beta versions');
    assert.notExists('.test-ember-version-compatibility-ember-version:contains(canary)', 'does not display canary versions');
  });
});

test('displays semver string with compatibility when all tests passed', function(assert) {
  let { addon } = createAddonWithVersionCompatibilities(['2.1.0', '2.2.0', '2.3.0', '2.4.0']);

  visitAddon(addon);
  andThen(function() {
    assert.contains('.test-ember-version-compatibility-semver-compat', 'Ember >=2.1.0 <=2.4.0');
  });
});

test('displays date/time when tests were last run', function(assert) {
  let { addon, testResult } = createAddonWithVersionCompatibilities(['2.1.0', '2.2.0', '2.3.0', '2.4.0']);
  server.db.testResults.update(testResult.id, { testsRunAt: moment.utc().subtract(1, 'day') });

  visitAddon(addon);
  andThen(function() {
    assert.contains('.test-ember-version-compatibility-timestamp', 'a day ago');
  });
});

test('displays tests results from the latest version with them, if the newest version has none', function(assert) {
  server.logging = true;
  let { addon } = createAddonWithVersionCompatibilities(['2.1.0', '2.2.0', '2.3.0', '2.4.0']);
  server.create('version', { addonId: addon.id });

  visitAddon(addon);
  andThen(function() {
    assert.exists('.test-ember-version-compatibility-section', 'version compatibility list displays');
    assert.exists('.test-ember-version-compatibility-new-version-warning', '"New version" warning displays');
  });
});

test('compatibility table is hidden but toggleable when all tests pass', function(assert) {
  let { addon } = createAddonWithVersionCompatibilities(['2.3.0', '2.4.0']);
  visitAddon(addon);

  andThen(() => assert.notExists('.test-ember-version-compatibility-list', 'version compatibility list is not displayed initially'));

  click('.test-ember-version-compatibility-show-table');
  andThen(() => assert.exists('.test-ember-version-compatibility-list', 'version compatiblity list is displayed after clicking toggle'));

  click('.test-ember-version-compatibility-show-table');
  andThen(() => assert.notExists('.test-ember-version-compatibility-list'), 'version compatibility list is not displayed after clicking toggle again');
});

test('preface text for timestamp depends on status of tests', function(assert) {
  let { addon: addonWithAllPassing }  = createAddonWithVersionCompatibilities(['2.3.0', '2.4.0']);
  let { addon: addonWithSomePassing } = createAddonWithVersionCompatibilities([failedVersion('2.3.0'), '2.4.0']);
  let { addon: addonWithTestFailure } = createAddonWithTestFailure();

  visitAddon(addonWithAllPassing);
  andThen(() => assert.contains('.test-ember-version-compatibility-timestamp', 'last ran'));

  visitAddon(addonWithSomePassing);
  andThen(() => assert.contains('.test-ember-version-compatibility-timestamp', 'last ran'));

  visitAddon(addonWithTestFailure);
  andThen(() => assert.contains('.test-ember-version-compatibility-timestamp', 'last tried'));
});

test('sets correct CSS class based on result', function(assert) {
  let { addon } = createAddonWithVersionCompatibilities([failedVersion('2.3.0'), '2.4.0']);

  visitAddon(addon);

  andThen(function() {
    assert.ok(find('.test-ember-version-compatibility-test-result:eq(0) .result-passed'), 'passing tests get the "result-passed" CSS class');
    assert.ok(find('.test-ember-version-compatibility-test-result:eq(1) .result-passed'), 'failing tests get the "result-failed" CSS class');
  });
});

test('uses the latest build for version compatibility', function(assert) {
  let addon = server.create('addon');
  let version = server.create('version', { addonId: addon.id });
  let middleTestResult = server.create('testResult', {
    testsRunAt: moment().subtract(1, 'hour').utc()
  });
  let latestTestResult = server.create('testResult', {
    succeeded: false,
    testsRunAt: moment().subtract(30, 'minutes').utc(),
    versionId: version.id
  });
  let earliestTestResult = server.create('testResult', {
    succeeded: true,
    testsRunAt: moment().subtract(2, 'hours').utc(),
    versionId: version.id
  });
  server.db.versions.update(version, { testResultIds: [middleTestResult.id, latestTestResult.id, earliestTestResult.id] });

  visitAddon(addon);
  andThen(function() {
    assert.exists('.test-ember-version-compatibility-unknown');
  });
});

test('excludes canary-only builds for version compatiblity purposes', function(assert) {
  let addon = server.create('addon');
  let version = server.create('version', { addonId: addon.id });
  let testResults = server.createList('testResult', 5, {
    canary: true,
    succeeded: true,
    testsRunAt: (i) => moment().subtract(i + 1, 'hours').utc(),
    versonId: version.id
  });
  testResults.push(server.create('testResult', {
    succeeded: false,
    testsRunAt: moment().subtract(6, 'hours').utc(),
    versionId: version.id
  }));
  testResults.concat(server.createList('testResult', 5, {
    canary: true,
    succeeded: true,
    testsRunAt: (i) => moment().subtract(7 + i, 'hours').utc(),
    versionId: version.id
  }));

  visitAddon(addon);
  andThen(function() {
    assert.exists('.test-ember-version-compatibility-unknown');
  });
});

function failedVersion(version) {
  return { version, compatible: false };
}

function createAddonWithVersionCompatibilities(emberVersions) {
  let addon = server.create('addon');
  let testResult = server.create('testResult');
  let emberVersionCompatibilities = emberVersions.map((emberVersion) => {
    let version = emberVersion;
    let compatible = true;
    if (typeof(emberVersion) === 'object') {
      version = emberVersion.version;
      compatible = emberVersion.hasOwnProperty('compatible') ? emberVersion.compatible : true;
    }
    return server.create('emberVersionCompatibility', { emberVersion: version, compatible });
  });

  server.create('testResult', { id: 42 });

  let version = server.create('version', {
    addonId: addon.id
  });

  testResult.update({
    emberVersionCompatibilityIds: emberVersionCompatibilities.map((x) => x.id),
    versionId: version.id
  });

  return { addon, testResult, emberVersionCompatibilities, version };
}

function createAddonWithTestFailure() {
  let addon = server.create('addon');
  let testResult = server.create('testResult', { succeeded: false });
  let version = server.create('version', { addonId: addon.id });
  testResult.update('versionId', version.id);

  return { addon, version, testResult };
}

import { test } from 'qunit';
import moduleForAcceptance from 'ember-addon-review/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | version compatibility');

test('displays Ember version compatibility when an addon has it', function(assert) {
  let { addon } = createAddonWithVersionCompatibilities([ '2.0.0' ]);

  visit(`/addons/${addon.name}`);
  andThen(function() {
    assert.exists('.test-ember-version-compatibility-list', 'version compatibility list displays');
    assert.containsExactly('.test-ember-version-compatibility-ember-version', '2.0.0');
    assert.containsExactly('.test-ember-version-compatibility-is-compatible', 'yes');
  });
});

test('sorts version compatibility entries by version number', function(assert) {
  let { addon } = createAddonWithVersionCompatibilities([ '2.0.3', '1.13.13', '2.1.2', '1.12.1' ]);

  visitAddon(addon);
  andThen(function() {
    assert.containsExactly('.test-ember-version-compatibility-ember-version:eq(0)', '1.12.1');
    assert.containsExactly('.test-ember-version-compatibility-ember-version:eq(1)', '1.13.13');
    assert.containsExactly('.test-ember-version-compatibility-ember-version:eq(2)', '2.0.3');
    assert.containsExactly('.test-ember-version-compatibility-ember-version:eq(3)', '2.1.2');
  });
});

test("displays appropriate text when an addon's test result indicated a failure", function(assert) {
  let addon = server.create('addon');
  let testResult = server.create('test_result', { succeeded: false });
  server.create('version', { addon_id: addon.id, test_result_id: testResult.id });

  visitAddon(addon);
  andThen(function() {
    assert.exists('.test-ember-version-compatibility-section', 'displays the version compatibility section');
    assert.exists('.test-ember-version-compatibility-unknown', 'displays a message');
  });
});

test('does not display Ember version compatibility when an addon does not have it', function(assert) {
  let addon = server.create('addon');
  server.create('version', { addon_id: addon.id });

  visitAddon(addon);
  andThen(() => assert.notExists('.test-ember-version-compatibility-section'));
});

test('hides beta and canary versions from the table', function(assert) {
  let { addon } = createAddonWithVersionCompatibilities([ '2.4.3', '2.5.0-beta.3+7c4288b9', '2.6.0-canary+e35e8b48' ]);

  visitAddon(addon);
  andThen(function() {
    assert.exists('.test-ember-version-compatibility-ember-version', 1);
    assert.notExists('.test-ember-version-compatibility-ember-version:contains(beta)', 'does not display beta versions');
    assert.notExists('.test-ember-version-compatibility-ember-version:contains(canary)', 'does not display canary versions');
  });
});

function createAddonWithVersionCompatibilities(emberVersionStrings)
{
  let addon = server.create('addon');
  let testResult = server.create('test_result');
  let emberVersionCompatibilities = emberVersionStrings.map(emberVersionString =>
    server.create('ember_version_compatibility', { ember_version: emberVersionString, test_result_id: testResult.id })
  );
  server.db.test_results.update(testResult, { ember_version_compatibility_ids: emberVersionCompatibilities.map(x => x.id) });
  let version = server.create('version', { addon_id: addon.id, test_result_id: testResult.id });

  return { addon, testResult, emberVersionCompatibilities, version };
}

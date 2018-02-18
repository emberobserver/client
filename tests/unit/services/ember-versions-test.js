import EmberVersionData from '../../ember-version-response';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | ember versions', function(hooks) {
  setupTest(hooks);

  test('versionData returns empty array if data is empty', function(assert) {
    let service = this.owner.factoryFor('service:ember-versions').create({ data: [] });
    assert.deepEqual(service.get('versionData'), []);
  });

  test('versionData returns empty array if data is null', function(assert) {
    let service = this.owner.factoryFor('service:ember-versions').create({ data: null });
    assert.deepEqual(service.get('versionData'), []);
  });

  test('versionData includes only major and minor releases', function(assert) {
    assert.expect(8);
    let service = this.owner.factoryFor('service:ember-versions').create({ data: EmberVersionData });
    let expectedVersions = ['Ember v1.8.0', 'Ember v1.9.0', 'Ember v1.10.0', 'Ember v1.11.0', 'Ember v1.12.0', 'Ember v1.13.0', 'Ember v2.0.0'];
    let versionData = service.get('versionData');

    assert.equal(versionData.length, expectedVersions.length, 'Only the expected versions should be included in the versionData');
    expectedVersions.forEach(function(version) {
      let foundVersion = versionData.findBy('version', version);
      assert.ok(foundVersion, `Version ${version} should be in versionData`);
    });
  });
});
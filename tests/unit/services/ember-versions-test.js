import EmberVersionData from '../../ember-version-response';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:ember-versions', 'Unit | Service | ember versions', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('versionData returns empty array if data is empty', function(assert) {
  var service = this.subject({ data: [] });
  assert.deepEqual(service.get('versionData'), []);
});

test('versionData returns empty array if data is null', function(assert) {
  var service = this.subject({ data: null });
  assert.deepEqual(service.get('versionData'), []);
});

test('versionData includes only major and minor releases', function(assert) {
  assert.expect(8);
  var service = this.subject({ data: EmberVersionData });
  var expectedVersions = ['Ember v1.8.0', 'Ember v1.9.0', 'Ember v1.10.0', 'Ember v1.11.0', 'Ember v1.12.0', 'Ember v1.13.0', 'Ember v2.0.0'];
  var versionData = service.get('versionData');

  assert.equal(versionData.length, expectedVersions.length, 'Only the expected versions should be included in the versionData');
  expectedVersions.forEach(function(version) {
    let foundVersion = versionData.findBy('version', version);
    assert.ok(foundVersion, `Version ${version} should be in versionData`);
  });
});

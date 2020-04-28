import normalizeFingerprintedAsset from 'ember-observer/utils/normalize-fingerprinted-asset';
import { module, test } from 'qunit';

module('Unit | Utility | normalize-fingerprinted-asset', function() {

  test('strips fingerprint and path out of filename', function(assert) {
    assert.equal(
      normalizeFingerprintedAsset('dist/assets/auto-import-fastboot-b9d4d40d7911648425e44ca094c7de8d.js'),
      'auto-import-fastboot.js'
    );

    assert.equal(
      normalizeFingerprintedAsset('dist/assets/chunk.ffb692bd5eacbc9e936d.js'),
      'chunk.js'
    );
  });
});

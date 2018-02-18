import EmberObject from '@ember/object';
import computedPercent from 'ember-observer/utils/computed-percent';
import { module, test } from 'qunit';

module('Unit | Utils | computedPercent', function() {
  function subject(dividend, divisor) {
    let ObjUnderTest = EmberObject.extend({
      divided: computedPercent('dividend', 'divisor')
    });
    let instance = ObjUnderTest.create({
      dividend, divisor
    });
    return instance.get('divided');
  }

  test('returns null when divisor is 0', function(assert) {
    assert.equal(subject(42, 0), null, 'returns null when divisor is 0');
  });

  test('returns the result as a percent', function(assert) {
    assert.equal(subject(3, 6), 50, 'returns the result of the division as a percent');
    assert.equal(subject(1, 3), 33.33333333333333, 'works with float results');
  });
});
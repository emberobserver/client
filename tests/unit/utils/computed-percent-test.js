import computedPercent from 'ember-addon-review/utils/computed-percent';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Utils | computedPercent');

function subject(dividend, divisor) {
  let ObjUnderTest = Ember.Object.extend({
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

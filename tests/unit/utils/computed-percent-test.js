import computedPercent from 'ember-observer/utils/computed-percent';
import { tracked } from '@glimmer/tracking';
import { module, test } from 'qunit';

module('Unit | Utils | computedPercent', function () {
  function subject(dividend, divisor) {
    let ObjUnderTest = class {
      dividend;
      divisor;
      @computedPercent('dividend', 'divisor') divided;
    };
    let instance = new ObjUnderTest();
    instance.dividend = dividend;
    instance.divisor = divisor;
    return instance.divided;
  }

  test('returns null when divisor is 0', function (assert) {
    assert.equal(subject(42, 0), null, 'returns null when divisor is 0');
  });

  test('returns the result as a percent', function (assert) {
    assert.equal(
      subject(3, 6),
      50,
      'returns the result of the division as a percent'
    );
    assert.equal(subject(1, 3), 33.33333333333333, 'works with float results');
  });

  test('updates when values change', function (assert) {
    let ObjUnderTest = class {
      @tracked dividend = 4;
      @tracked divisor = 8;
      @computedPercent('dividend', 'divisor') divided;
    };

    let instance = new ObjUnderTest();
    assert.equal(instance.divided, 50);

    instance.divisor = 12;
    assert.equal(instance.divided, 33.33333333333333);
  });
});

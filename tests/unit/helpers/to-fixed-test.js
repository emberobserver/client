import { module, test } from 'qunit';
import { toFixed } from 'ember-observer/helpers/to-fixed';

module('Integration | Helper | to-fixed', function() {

  test('it returns toFixed based on inputs', function(assert) {
    assert.equal(toFixed([1.253, 2]), '1.25');
    assert.equal(toFixed([1.253, 1]), '1.3');
    assert.equal(toFixed([0, 0]), '0');
  });
});

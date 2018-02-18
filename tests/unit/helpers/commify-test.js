import { commify } from 'ember-observer/helpers/commify';
import { module, test } from 'qunit';

module('Unit | Helper | commify', function() {
  test('does not add commas to numbers less than 1000', function(assert) {
    assert.equal(commify([1]), '1');
    assert.equal(commify([42]), '42');
    assert.equal(commify([987]), '987');
  });

  test('adds commas to numbers >= 1000', function(assert) {
    assert.equal(commify([1000]), '1,000');
    assert.equal(commify([35000]), '35,000');
    assert.equal(commify([2147483647]), '2,147,483,647');
  });

  test('returns 0 when input is null or undefined', function(assert) {
    assert.equal(commify([]), '0');
    assert.equal(commify([void(0)]), '0');
    assert.equal(commify([null]), '0');
  });
});
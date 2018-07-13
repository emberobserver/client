import { module, test } from 'qunit';
import { previousItem } from 'ember-observer/helpers/previous-item';

module('Unit | Helper | previous item', function() {
  test('Returns the previous item in the array', function(assert) {
    let item = { name: 'Merry' };
    let arr = [ {name: 'Pippin' }, item, { name: 'Cat'} ];
    let result = previousItem([arr, item]);
    assert.equal(result.name, 'Pippin', 'returns the previous item in array');
  });

  test('Returns the previous item in the array for last item', function(assert) {
    let item = { name: 'Merry' };
    let arr = [ {name: 'Pippin' }, { name: 'Cat'}, item ];
    let result = previousItem([arr, item]);
    assert.equal(result.name, 'Cat', 'returns the previous item in array');
  });

  test('Returns undefined if no previous item', function(assert) {
    let item = { name: 'Merry' };
    let arr = [ item, { name: 'Pippin' }, { name: 'Cat'} ];
    let result = previousItem([arr, item]);
    assert.equal(result, undefined, 'No result for last item in array');
  });
});

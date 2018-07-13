import { module, test } from 'qunit';
import { nextItem } from 'ember-observer/helpers/next-item';

module('Unit | Helper | next item', function() {
  test('Returns the next item in the array', function(assert) {
    let item = { name: 'Merry' };
    let arr = [ {name: 'Pippin' }, item, { name: 'Cat'} ];
    let result = nextItem([arr, item]);
    assert.equal(result.name, 'Cat', 'returns the next item in array');
  });

  test('Returns the next item in the array for first item', function(assert) {
    let item = { name: 'Merry' };
    let arr = [ item, {name: 'Pippin' }, { name: 'Cat'} ];
    let result = nextItem([arr, item]);
    assert.equal(result.name, 'Pippin', 'returns the next item in array');
  });

  test('Returns undefined if no next item', function(assert) {
    let item = { name: 'Merry' };
    let arr = [ {name: 'Pippin' }, { name: 'Cat'}, item ];
    let result = nextItem([arr, item]);
    assert.equal(result, undefined, 'No result for last item in array');
  });
});

import { module, test } from 'qunit';
import { scoreComponentColor } from 'ember-observer/helpers/score-component-color';

module('Integration | Helper | score-component-color', function() {

  test('returns color based on argument', function(assert) {
    assert.equal(scoreComponentColor([1]), 'green');
    assert.equal(scoreComponentColor([0.49]), 'red');
    assert.equal(scoreComponentColor([0.51]), 'yellow');
    assert.equal(scoreComponentColor([0]), 'red');
  });
});

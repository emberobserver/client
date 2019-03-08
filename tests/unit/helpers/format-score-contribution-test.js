import { module, test } from 'qunit';
import { formatScoreContribution } from 'ember-observer/helpers/format-score-contribution';

module('Integration | Helper | format-score-contribution', function() {

  test('is argument * max score', function(assert) {
    assert.equal(formatScoreContribution([1]), 10);
    assert.equal(formatScoreContribution([0]), 0);
  });
});

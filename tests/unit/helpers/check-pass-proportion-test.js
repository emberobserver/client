import { module, test } from 'qunit';
import { checkPassProportion } from 'ember-observer/helpers/check-pass-proportion';

module('Integration | Helper | check-pass-proportion', function() {

  test('is proportion of contribution to max contribution', function(assert) {
    assert.equal(checkPassProportion([{ contribution: 1, maxContribution: 10 }]), 0.1);
    assert.equal(checkPassProportion([{ contribution: 1, maxContribution: 100 }]), 0.01);
    assert.equal(checkPassProportion([{ contribution: 0, maxContribution: 10 }]), 0);
    assert.equal(checkPassProportion([{ contribution: 0.245, maxContribution: 0.557 }]), 0.44, 'Max two digits');
  });
});

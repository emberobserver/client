import Ember from 'ember';

export default Ember.Helper.helper(function testResultStatus([testResult]) {
  if (testResult.get('succeeded')) {
    if (testResult.get('emberVersionCompatibilities.firstObject.compatible')) {
      return 'Passed';
    } else {
      return 'Failed';
    }
  } else {
    return `Error: ${testResult.get('statusMessage') || 'unknown'}`;
  }
});

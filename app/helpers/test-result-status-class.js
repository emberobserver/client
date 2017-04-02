import Ember from 'ember';

export default Ember.Helper.helper(function testResultStatusClass([testResult]) {
  if (testResult.get('succeeded')) {
    if (testResult.get('emberVersionCompatibilities.firstObject.compatible')) {
      return 'passed';
    } else {
      return 'failed';
    }
  } else {
    return 'error';
  }
});

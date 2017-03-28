import Ember from 'ember';

function computedDivide(a, b) {
  return Ember.computed(a, b, function() {
    let bVal = this.get(b);
    if (!bVal) {
      return '--';
    }
    let result = (this.get(a) / bVal) * 100;
    return result.toFixed(2);
  });
}

export default Ember.Component.extend({
  errorBuilds: Ember.computed.filter('testResults', (testResult) => {
    return !testResult.get('succeeded');
  }),
  failedBuilds: Ember.computed.filter('testResults', (testResult) => {
    return testResult.get('succeeded') && !testResult.get('emberVersionCompatibilities.firstObject.compatible');
  }),
  passedBuilds: Ember.computed.filter('testResults', (testResult) => {
    return testResult.get('succeeded') && testResult.get('emberVersionCompatibilities.firstObject.compatible');
  }),

  numberOfErrorBuilds: Ember.computed.readOnly('errorBuilds.length'),
  numberOfFailedBuilds: Ember.computed.readOnly('failedBuilds.length'),
  numberOfPassedBuilds: Ember.computed.readOnly('passedBuilds.length'),
  numberOfBuilds: Ember.computed.readOnly('testResults.length'),

  percentOfErrorBuilds: computedDivide('numberOfErrorBuilds', 'numberOfBuilds'),
  percentOfFailedBuilds: computedDivide('numberOfFailedBuilds', 'numberOfBuilds'),
  percentOfPassedBuilds: computedDivide('numberOfPassedBuilds', 'numberOfBuilds')
});

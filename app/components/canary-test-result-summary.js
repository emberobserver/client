import Ember from 'ember';
import computedPercent from 'ember-observer/utils/computed-percent';

function computedFormattedPercent(percentPropertyName) {
  return Ember.computed(percentPropertyName, function() {
    let value = this.get(percentPropertyName);
    if (!value) {
      return '--';
    }
    value = value.toFixed(2);
    return `${value}%`;
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

  percentOfErrorBuilds: computedPercent('numberOfErrorBuilds', 'numberOfBuilds'),
  percentOfFailedBuilds: computedPercent('numberOfFailedBuilds', 'numberOfBuilds'),
  percentOfPassedBuilds: computedPercent('numberOfPassedBuilds', 'numberOfBuilds'),

  formattedPercentOfErrorBuilds: computedFormattedPercent('percentOfErrorBuilds'),
  formattedPercentOfFailedBuilds: computedFormattedPercent('percentOfFailedBuilds'),
  formattedPercentOfPassedBuilds: computedFormattedPercent('percentOfPassedBuilds')
});

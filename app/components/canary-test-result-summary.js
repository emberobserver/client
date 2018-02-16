import { filter, readOnly } from '@ember/object/computed';
import Component from '@ember/component';
import { computed } from '@ember/object';
import computedPercent from 'ember-observer/utils/computed-percent';

function computedFormattedPercent(percentPropertyName) {
  return computed(percentPropertyName, function() {
    let value = this.get(percentPropertyName);
    if (!value) {
      return '--';
    }
    value = value.toFixed(2);
    return `${value}%`;
  });
}

export default Component.extend({
  errorBuilds: filter('testResults', (testResult) => {
    return !testResult.get('succeeded');
  }),
  failedBuilds: filter('testResults', (testResult) => {
    return testResult.get('succeeded') && !testResult.get('emberVersionCompatibilities.firstObject.compatible');
  }),
  passedBuilds: filter('testResults', (testResult) => {
    return testResult.get('succeeded') && testResult.get('emberVersionCompatibilities.firstObject.compatible');
  }),

  numberOfErrorBuilds: readOnly('errorBuilds.length'),
  numberOfFailedBuilds: readOnly('failedBuilds.length'),
  numberOfPassedBuilds: readOnly('passedBuilds.length'),
  numberOfBuilds: readOnly('testResults.length'),

  percentOfErrorBuilds: computedPercent('numberOfErrorBuilds', 'numberOfBuilds'),
  percentOfFailedBuilds: computedPercent('numberOfFailedBuilds', 'numberOfBuilds'),
  percentOfPassedBuilds: computedPercent('numberOfPassedBuilds', 'numberOfBuilds'),

  formattedPercentOfErrorBuilds: computedFormattedPercent('percentOfErrorBuilds'),
  formattedPercentOfFailedBuilds: computedFormattedPercent('percentOfFailedBuilds'),
  formattedPercentOfPassedBuilds: computedFormattedPercent('percentOfPassedBuilds')
});

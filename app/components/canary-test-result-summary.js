import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { readOnly, filter } from '@ember/object/computed';
import Component from '@ember/component';
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

@classic
export default class CanaryTestResultSummary extends Component {
  @filter('testResults', (testResult) => {
    return !testResult.get('succeeded');
  })
  errorBuilds;

  @filter('testResults', (testResult) => {
    return testResult.get('succeeded') && !testResult.get('emberVersionCompatibilities.firstObject.compatible');
  })
  failedBuilds;

  @filter('testResults', (testResult) => {
    return testResult.get('succeeded') && testResult.get('emberVersionCompatibilities.firstObject.compatible');
  })
  passedBuilds;

  @readOnly('errorBuilds.length')
  numberOfErrorBuilds;

  @readOnly('failedBuilds.length')
  numberOfFailedBuilds;

  @readOnly('passedBuilds.length')
  numberOfPassedBuilds;

  @readOnly('testResults.length')
  numberOfBuilds;

  @computedPercent('numberOfErrorBuilds', 'numberOfBuilds')
  percentOfErrorBuilds;

  @computedPercent('numberOfFailedBuilds', 'numberOfBuilds')
  percentOfFailedBuilds;

  @computedPercent('numberOfPassedBuilds', 'numberOfBuilds')
  percentOfPassedBuilds;

  @computedFormattedPercent('percentOfErrorBuilds')
  formattedPercentOfErrorBuilds;

  @computedFormattedPercent('percentOfFailedBuilds')
  formattedPercentOfFailedBuilds;

  @computedFormattedPercent('percentOfPassedBuilds')
  formattedPercentOfPassedBuilds;
}

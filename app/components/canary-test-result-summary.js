import asArray from 'ember-observer/utils/as-array';
import { get } from '@ember/object';
import { computed } from '@ember/object';
import { filter } from '@ember/object/computed';
import Component from '@glimmer/component';
import computedPercent from 'ember-observer/utils/computed-percent';

function computedFormattedPercent(percentPropertyName) {
  return computed(percentPropertyName, function () {
    let value = get(this, percentPropertyName);
    if (!value) {
      return '--';
    }
    value = value.toFixed(2);
    return `${value}%`;
  });
}

export default class CanaryTestResultSummary extends Component {
  @filter('args.testResults', (testResult) => {
    return !get(testResult, 'succeeded');
  })
  errorBuilds;

  @filter('args.testResults', (testResult) => {
    return (
      get(testResult, 'succeeded') &&
      !asArray(get(testResult, 'emberVersionCompatibilities'))[0]?.compatible
    );
  })
  failedBuilds;

  @filter('args.testResults', (testResult) => {
    return (
      get(testResult, 'succeeded') &&
      asArray(get(testResult, 'emberVersionCompatibilities'))[0]?.compatible
    );
  })
  passedBuilds;

  get numberOfErrorBuilds() {
    return this.errorBuilds?.length;
  }

  get numberOfFailedBuilds() {
    return this.failedBuilds?.length;
  }

  get numberOfPassedBuilds() {
    return this.passedBuilds?.length;
  }

  get numberOfBuilds() {
    return this.args.testResults?.length;
  }

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

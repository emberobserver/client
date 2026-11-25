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

export default class CanaryTestResultSummary extends Component {<template><div ...attributes>
<table class="test-result-summary-table">
  <thead>
    <tr>
      <th>
        Status
      </th>
      <th>
        Number of builds
      </th>
      <th>
        Percent of builds
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="test-result passed">
        Passed
      </td>
      <td>
        {{this.numberOfPassedBuilds}}
      </td>
      <td>
        {{this.formattedPercentOfPassedBuilds}}
      </td>
    </tr>
    <tr>
      <td class="test-result failed">
        Failed
      </td>
      <td>
        {{this.numberOfFailedBuilds}}
      </td>
      <td>
        {{this.formattedPercentOfFailedBuilds}}
      </td>
    </tr>
    <tr>
      <td class="test-result error">
        Error
      </td>
      <td>
        {{this.numberOfErrorBuilds}}
      </td>
      <td>
        {{this.formattedPercentOfErrorBuilds}}
      </td>
    </tr>
  </tbody>
</table>
</div>
</template>
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

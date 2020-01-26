import Component from '@glimmer/component';

export default class BuildResultSummaryTableRow extends Component {
  get testResultClass() {
    if (this.args.scenario.passed) {
      return 'passed';
    }
    if (this.args.scenario.allowedToFail) {
      return 'allowed-failure';
    }
    return 'failed';
  }
}

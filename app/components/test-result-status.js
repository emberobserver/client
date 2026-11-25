import asArray from 'ember-observer/utils/as-array';
import { get } from '@ember/object';
import Component from '@glimmer/component';

export default class TestResultStatus extends Component {
  get statusText() {
    if (get(this.args, 'testResult.succeeded')) {
      if (
        asArray(get(this.args, 'testResult.emberVersionCompatibilities'))[0]?.compatible
      ) {
        return 'Passed';
      } else {
        return 'Failed';
      }
    } else {
      return 'Error';
    }
  }

  get statusDetail() {
    if (!get(this.args, 'testResult.succeeded')) {
      return get(this.args, 'testResult.statusMessage') || 'unknown';
    }
    return null;
  }
}

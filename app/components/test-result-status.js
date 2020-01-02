import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import Component from '@ember/component';

@classic
@tagName('')
export default class TestResultStatus extends Component {
  @computed(
    'testResult.succeeded',
    'testResult.emberVersionCompatibilities.firstObject.compatible'
  )
  get statusText() {
    if (this.get('testResult.succeeded')) {
      if (this.get('testResult.emberVersionCompatibilities.firstObject.compatible')) {
        return 'Passed';
      } else {
        return 'Failed';
      }
    } else {
      return 'Error';
    }
  }

  @computed('testResult.succeeded', 'testResult.statusMessage')
  get statusDetail() {
    if (!this.get('testResult.succeeded')) {
      return this.get('testResult.statusMessage') || 'unknown';
    }
    return null;
  }
}

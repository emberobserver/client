import { tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { readOnly, equal } from '@ember/object/computed';
import Component from '@ember/component';

@tagName('')
export default class BuildResultOutput extends Component {
  @equal('buildResult.outputFormat', 'json')
  isJsonFormat;

  @computed('buildResult.output')
  get parsedJSON() {
    return JSON.parse(this.buildResult.output);
  }

  @readOnly('parsedJSON')
  groups;
}

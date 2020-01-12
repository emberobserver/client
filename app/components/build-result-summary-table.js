import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { readOnly } from '@ember/object/computed';
import Component from '@ember/component';

@classic
@tagName('')
export default class BuildResultSummaryTable extends Component {
  @readOnly('results.scenarios')
  scenarios;
}

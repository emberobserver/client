import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

@classic
@tagName('')
export default class ToggleSwitch extends Component {
  label = '';
  onToggle = null;
  isChecked = null;
}

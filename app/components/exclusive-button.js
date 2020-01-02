import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

@classic
@tagName('')
export default class ExclusiveButton extends Component {
  label = '';
  value = null;
  selectedValue = null;
  updateSelectedValue = null;
}

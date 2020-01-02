import classic from 'ember-classic-decorator';
import Component from '@ember/component';

@classic
export default class ExclusiveButtonGroup extends Component {
  selectedValue = null;
  updateSelectedValue = null;
}

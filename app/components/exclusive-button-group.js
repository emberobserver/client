import classic from 'ember-classic-decorator';
import Component from '@ember/component';

@classic
export default class ExclusiveButtonGroupComponent extends Component {
  selectedValue = null;
  updateSelectedValue = null;
}

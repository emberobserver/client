import classic from 'ember-classic-decorator';
import Component from '@ember/component';

@classic
export default class RadioButtonSet extends Component {
  select(option) {
    this.set('selected', option);
    this.selectOption(this.valueField, option.value);
  }
}

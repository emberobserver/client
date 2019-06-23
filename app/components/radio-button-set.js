import classic from 'ember-classic-decorator';
import Component from '@ember/component';

@classic
export default class RadioButtonSetComponent extends Component {
  select(option) {
    this.set('selected', option);
    this.get('selectOption')(this.get('valueField'), option.value);
  }
}

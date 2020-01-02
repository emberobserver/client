import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { computed } from '@ember/object';
import Component from '@ember/component';

@classic
@tagName('span')
export default class RadioButton extends Component {
  @computed('selected', 'option')
  get isSelected() {
    let selected = this.selected;
    let opt = this.option;
    if (!selected) {
      return false;
    }
    return opt.value === selected.value;
  }
}

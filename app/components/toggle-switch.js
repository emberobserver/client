import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ToggleSwitch extends Component {
  @action
  onToggle(event) {
    const checked = event.target.checked;
    this.args.onToggle(checked);
  }
}

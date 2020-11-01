import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class ExclusiveButton extends Component {
  @action
  updateSelectedValue(event) {
    event.preventDefault();
    this.args.updateSelectedValue(this.args.value);
  }
}

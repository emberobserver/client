import Component from '@glimmer/component';

export default class ExclusiveButtonGroup extends Component {
  get selectedValue() {
    return this.args.selectedValue;
  }

  get updateSelectedValue() {
    return this.args.updateSelectedValue;
  }
}

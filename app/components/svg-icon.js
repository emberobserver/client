/* eslint-disable ember/no-classic-classes */
import Component from '@glimmer/component';

export default class SvgIcon extends Component {
  get alignBaseline() {
    return this.args.alignBaseline ?? true;
  }
}

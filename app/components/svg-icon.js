import Component from '@glimmer/component';
import { isPresent } from '@ember/utils';

export default class SvgIcon extends Component {
  get alignBaseline() {
    if (isPresent(this.args.alignBaseline)) {
      return this.args.alignBaseline;
    }
    return true;
  }
}

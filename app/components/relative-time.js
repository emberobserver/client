import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class RelativeTime extends Component {
  @service currentDate;

  get isoDate() {
    let date = this.args.date;
    return date ? date.toISOString() : null;
  }
}

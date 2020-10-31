import Component from '@glimmer/component';

export default class RelativeTime extends Component {
  get isoDate() {
    let date = this.args.date;
    return date ? date.toISOString() : null;
  }
}

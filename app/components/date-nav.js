import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import moment from 'moment';

export default class DateNavComponent extends Component {
  @tracked date;

  get formattedDisplayDate() {
    return moment(this.args.date).utc().format('YYYY-MM-DD');
  }

  get formattedPreviousDate() {
    return moment(this.args.date).subtract(1, 'day').format('YYYY-MM-DD');
  }

  get formattedFollowingDate() {
    return moment(this.args.date).add(1, 'day').format('YYYY-MM-DD');
  }

  get showFollowingDayLink() {
    let dateFromParam = moment(this.args.date);
    let currentDate = moment();
    return !dateFromParam.isSame(currentDate, 'day');
  }
}

import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import Controller from '@ember/controller';
import moment from 'moment';

@classic
export default class DateController extends Controller {
  @readOnly('model.date')
  date;

  @computed('date')
  get formattedDisplayDate() {
    return moment(this.date).utc().format('YYYY-MM-DD');
  }

  @computed('date')
  get formattedPreviousDate() {
    let date = this.date;
    return moment(date).subtract(1, 'day').format('YYYY-MM-DD');
  }

  @computed('date')
  get formattedFollowingDate() {
    let date = this.date;
    return moment(date).add(1, 'day').format('YYYY-MM-DD');
  }

  @computed('date')
  get showFollowingDayLink() {
    let dateFromParam = moment(this.date);
    let currentDate = moment();
    return !dateFromParam.isSame(currentDate, 'day');
  }
}

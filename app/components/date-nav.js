import classic from 'ember-classic-decorator';
import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

@classic
export default class DateNavComponent extends Component {
  tagName = 'section';

  classNames = ['date-nav'];

  @computed('date')
  get formattedDisplayDate() {
    return moment(this.get('date')).utc().format('YYYY-MM-DD');
  }

  @computed('date')
  get formattedPreviousDate() {
    let date = this.get('date');
    return moment(date).subtract(1, 'day').format('YYYY-MM-DD');
  }

  @computed('date')
  get formattedFollowingDate() {
    let date = this.get('date');
    return moment(date).add(1, 'day').format('YYYY-MM-DD');
  }

  @computed('date')
  get showFollowingDayLink() {
    let dateFromParam = moment(this.get('date'));
    let currentDate = moment();
    return !dateFromParam.isSame(currentDate, 'day');
  }
}

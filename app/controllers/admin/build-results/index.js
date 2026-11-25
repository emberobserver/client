import { computed, get } from '@ember/object';
import Controller from '@ember/controller';
import moment from 'moment';
import { sortBy } from 'ember-observer/utils/as-array';

export default class IndexController extends Controller {
  queryParams = ['date'];
  buildResultSorting = ['testsRunAt:desc'];

  get sortedBuildResults() {
    return sortBy(get(this, 'model'), get(this, 'buildResultSorting'));
  }

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

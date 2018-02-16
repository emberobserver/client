import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';
import Controller from '@ember/controller';
import moment from 'moment';

export default Controller.extend({
  queryParams: ['date'],
  buildResultSorting: ['testsRunAt:desc'],
  sortedBuildResults: sort('model', 'buildResultSorting'),

  formattedDisplayDate: computed('date', function() {
    return moment(this.get('date')).utc().format('YYYY-MM-DD');
  }),

  formattedPreviousDate: computed('date', function() {
    let date = this.get('date');
    return moment(date).subtract(1, 'day').format('YYYY-MM-DD');
  }),

  formattedFollowingDate: computed('date', function() {
    let date = this.get('date');
    return moment(date).add(1, 'day').format('YYYY-MM-DD');
  }),
  showFollowingDayLink: computed('date', function() {
    let dateFromParam = moment(this.get('date'));
    let currentDate = moment();
    return !dateFromParam.isSame(currentDate, 'day');
  })
});

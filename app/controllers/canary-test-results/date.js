import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import Controller from '@ember/controller';
import moment from 'moment';

export default Controller.extend({
  date: readOnly('model.date'),

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

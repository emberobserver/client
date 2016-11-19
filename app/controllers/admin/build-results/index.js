import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  queryParams: [ 'date' ],
  buildResultSorting: [ 'testsRunAt:desc' ],
  sortedBuildResults: Ember.computed.sort('model', 'buildResultSorting'),

  previousDay: Ember.computed('date', function() {
    let date = this.get('date');
    return moment(date).subtract(1, 'day').format('YYYY-MM-DD');
  }),
  followingDay: Ember.computed('date', function() {
    let date = this.get('date');
    return moment(date).add(1, 'day').format('YYYY-MM-DD');
  }),
  showFollowingDayLink: Ember.computed('date', function() {
    let dateFromParam = moment(this.get('date'));
    let currentDate = moment();
    return !dateFromParam.isSame(currentDate, 'day');
  })
});

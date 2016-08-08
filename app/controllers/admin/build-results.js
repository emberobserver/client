import Ember from 'ember';

export default Ember.Controller.extend({
  buildResultSorting: [ 'testsRunAt:desc' ],
  sortedBuildResults: Ember.computed.sort('model', 'buildResultSorting')
});

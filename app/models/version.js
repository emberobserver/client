import DS from 'ember-data';
import Ember from 'ember';

const { attr, belongsTo, hasMany } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  version: attr('string'),
  released: attr('date'),
  emberCliVersion: attr('string'),
  addon: belongsTo('addon', { async: false }),
  review: belongsTo('review', { async: false }),
  testResults: hasMany('testResult', { async: false }),

  latestTestResult: computed('testResults.[]', function() {
    return this.get('testResults').filterBy('canary', false).sortBy('testsRunAt').get('lastObject');
  })
});

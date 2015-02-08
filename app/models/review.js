import Ember from 'ember';
import DS from 'ember-data';

var attr = DS.attr;
var belongsTo = DS.belongsTo;

export default DS.Model.extend({
  autoQuestions: [
    {text: 'Has it been released within the last 6 months', field: 'hasBeenReleasedRecently'}
  ],
  answerMap: {
    1: "Yes",
    2: "No",
    3: "N/A",
    4: "Unknown"
  },
  answer: function(){
    return this.answerMap[this.get('answerCode')];
  }.property('answerCode'),
  review: attr('string'),
  createdAt: attr('date'),
  version: belongsTo('version'),
  hasTests: attr('number'),
  hasReadme: attr('number'),
  isMoreThanEmptyAddon: attr('number'),
  isOpenSource: attr('number'),
  usesOnlyPublicApis: attr('number'),
  hasBuild: attr('number'),
  addon: Ember.computed.alias('version.addon'),
  hasBeenReleasedRecently: Ember.computed.alias('addon.hasBeenReleasedRecently'),
  hasLicense: Ember.computed.alias('addon.hasLicense')
});

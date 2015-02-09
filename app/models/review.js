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
  answeredQuestions: function(){
    var review = this;
    return this.questions.map(function(question){
      return Ember.Object.create({
        text: question.text,
        answer: review.answerMap[review.get(question.fieldName)]
      });
    });
  }.property(),
  questions: [
    {text: 'Is it more than an empty addon?', fieldName: 'isMoreThanEmptyAddon'},
    {text: 'Are there meaningful tests?', fieldName: 'hasTests'},
    {text: 'Is the README filled out?', fieldName: 'hasReadme'},
    {text: 'Is the source accessible?', fieldName: 'isOpenSource'},
    {text: 'If so, does the addon use only public Ember APIs?', fieldName: 'usesOnlyPublicApis'},
    {text: 'Does the addon have a build?', fieldName: 'hasBuild'}
  ],
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

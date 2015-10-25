import DS from 'ember-data';
import Ember from 'ember';

var attr = DS.attr;
var belongsTo = DS.belongsTo;

export default DS.Model.extend({
  questions: [
    { text: 'Is the source accessible?', fieldName: 'isOpenSource' },
    { text: 'Is it more than an empty addon?', fieldName: 'isMoreThanEmptyAddon' },
    { text: 'Are there meaningful tests?', fieldName: 'hasTests' },
    { text: 'Is the README filled out?', fieldName: 'hasReadme' },
    { text: 'Does the addon have a build?', fieldName: 'hasBuild' }
  ],
  review: attr('string'),
  createdAt: attr('date'),
  hasTests: attr('number'),
  hasReadme: attr('number'),
  isMoreThanEmptyAddon: attr('number'),
  isOpenSource: attr('number'),
  hasBuild: attr('number'),
  addon: belongsTo('addon', { async: false }),
  version: belongsTo('version', { async: false }),
  score: Ember.computed('hasTests', 'isMoreThanEmptyAddon', 'isOpenSource', 'hasBuild', 'hasReadme', function() {
    var s = 0;
    if (this.get('hasTests') === 1) { s++; }
    if (this.get('isMoreThanEmptyAddon') === 1) { s++; }
    if (this.get('isOpenSource') === 1) { s++; }
    if (this.get('hasBuild') === 1) { s++; }
    if (this.get('hasReadme') === 1) { s++; }
    return s;
  })
});

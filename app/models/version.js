import DS from 'ember-data';
import Ember from 'ember';

const { attr, belongsTo, hasMany } = DS;
const { computed } = Ember;

export default DS.Model.extend({
  version: attr('string'),
  released: attr('date'),
  emberCliVersion: attr('string'),
  addon: belongsTo('addon'),
  review: belongsTo('review')
});

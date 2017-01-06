import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default DS.Model.extend({
  version: attr('string'),
  released: attr('date'),
  emberCliVersion: attr('string'),
  addon: belongsTo('addon'),
  review: belongsTo('review')
});

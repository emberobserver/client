import DS from 'ember-data';

var attr = DS.attr;
var belongsTo = DS.belongsTo;

export default DS.Model.extend({
  version: attr('string'),
  released: attr('date'),
  addon: belongsTo('addon')
});

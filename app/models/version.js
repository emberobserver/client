import DS from 'ember-data';

var attr = DS.attr;
var belongsTo = DS.belongsTo;

export default DS.Model.extend({
  version: attr('string'),
  released: attr('date'),
  emberCliVersion: attr('string'),
  addon: belongsTo('addon', { async: false }),
  review: belongsTo('review', { async: false }),
  emberVersionCompatibilities: DS.hasMany('ember-version-compatibility', { async: false })
});

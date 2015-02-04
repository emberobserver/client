import DS from 'ember-data';

var attr = DS.attr;
var hasMany = DS.hasMany;

export default DS.Model.extend({
  keyword: attr('string'),
  packages: hasMany('package')
});

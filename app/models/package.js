import DS from 'ember-data';

var attr = DS.attr;
var hasMany = DS.hasMany;

export default DS.Model.extend({
  name: attr('string'),
  npmjsUrl: attr('string'),
  githubUrl: attr('string'),
  categories: hasMany('category')
});

import DS from 'ember-data';

var attr = DS.attr;
var hasMany = DS.hasMany;

export default DS.Model.extend({
  name: attr('string'),
  description: attr('string'),
  repositoryUrl: attr('string'),
  latestVersion: attr('string'),
  latestVersionDate: attr('date'),
  license: attr('string'),
  isDeprecated: attr('boolean'),
  note: attr('string'),
  isOfficial: attr('boolean'),
  isCliDependency: attr('boolean'),
  isHidden: attr('boolean'),
  categories: hasMany('category', {async: true}),
  keywords: hasMany('keyword', {async: true}),
  versions: hasMany('version', {async: true}),
  maintainers: hasMany('maintainer'),
  reviews: hasMany('review', {async: true}),
  npmUrl: function(){
    return `https://www.npmjs.com/package/${this.get('name')}`;
  }.property('name')
});

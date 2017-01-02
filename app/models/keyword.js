import DS from 'ember-data';

const { attr, hasMany } = DS;

export default DS.Model.extend({
  keyword: attr('string'),
  addons: hasMany('addon')
});

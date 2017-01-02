import DS from 'ember-data';

const { attr, hasMany } = DS;

export default DS.Model.extend({
  name: attr('string'),
  gravatar: attr('string'),
  addons: hasMany('addon', { async: true })
});

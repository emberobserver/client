import Model, { hasMany, attr } from '@ember-data/model';

export default Model.extend({
  keyword: attr('string'),
  addons: hasMany('addon')
});

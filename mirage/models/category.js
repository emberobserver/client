import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  parent: belongsTo('category', { inverse: 'subcategories' }),
  subcategories: hasMany('category', { inverse: 'parent' }),
  addons: hasMany('addon')
});

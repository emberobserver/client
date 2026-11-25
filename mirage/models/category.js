import { Model, hasMany, belongsTo } from 'miragejs';

export default Model.extend({
  parent: belongsTo('category', { inverse: 'subcategories' }),
  subcategories: hasMany('category', { inverse: 'parent' }),
  addons: hasMany('addon'),
});

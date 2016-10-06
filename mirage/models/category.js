import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  parent: belongsTo('category'),
  subcategories: hasMany('category')
});

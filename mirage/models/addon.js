import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  readme: belongsTo(),
  reviews: hasMany(),
  versions: hasMany(),
  keywords: hasMany()
});

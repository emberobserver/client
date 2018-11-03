import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  addon: belongsTo('addon', { inverse: 'versions' }),
  review: belongsTo(),
  testResults: hasMany(),
  dependencies: hasMany('addon-dependency')
});

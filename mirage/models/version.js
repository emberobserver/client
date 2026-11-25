import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  addon: belongsTo('addon', { inverse: 'versions' }),
  review: belongsTo(),
  addonSize: belongsTo(),
  testResults: hasMany(),
  dependencies: hasMany('addon-dependency'),
});

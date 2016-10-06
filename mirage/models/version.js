import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  addon: belongsTo(),
  review: belongsTo(),
  testResults: hasMany()
});

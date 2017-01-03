import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  version: belongsTo(),
  emberVersionCompatibilities: hasMany()
});

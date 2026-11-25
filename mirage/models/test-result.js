import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  version: belongsTo(),
  emberVersionCompatibilities: hasMany(),
});

import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  dependentVersion: belongsTo('version'),
  packageAddon: belongsTo('addon'),
});

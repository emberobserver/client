import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  addon: belongsTo(),
  version: belongsTo(),
});

import Model, { belongsTo, attr } from '@ember-data/model';

export default Model.extend({
  version: belongsTo('version'),
  emberVersion: attr('string'),
  compatible: attr('boolean')
});

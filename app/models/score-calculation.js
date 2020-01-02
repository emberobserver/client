import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  info: attr(),
  addon: belongsTo(),
  addonVersion: belongsTo()
});

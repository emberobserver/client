import Model, { hasMany, attr } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  gravatar: attr('string'),
  addons: hasMany('addon', { async: true })
});

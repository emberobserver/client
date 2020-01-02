import Model, { attr } from '@ember-data/model';

export default Model.extend({
  version: attr('string'),
  released: attr('date')
});

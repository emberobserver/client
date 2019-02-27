import DS from 'ember-data';

export default DS.Model.extend({
  version: DS.attr('string'),
  released: DS.attr('date')
});

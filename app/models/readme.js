import DS from 'ember-data';

export default DS.Model.extend({
  addon: DS.belongsTo('addon'),
  text: DS.attr('string')
});

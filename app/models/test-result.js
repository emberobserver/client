import DS from 'ember-data';

export default DS.Model.extend({
  succeeded: DS.attr('boolean'),
  status_message: DS.attr('string'),

  version: DS.belongsTo('version'),
  emberVersionCompatibilities: DS.hasMany('emberVersionCompatibility')
});

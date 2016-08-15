import DS from 'ember-data';

export default DS.Model.extend({
  succeeded: DS.attr('boolean'),
  statusMessage: DS.attr('string'),
  testsRunAt: DS.attr('date'),
  canary: DS.attr('boolean'),
  stdout: DS.attr('string'),
  stderr: DS.attr('string'),

  version: DS.belongsTo('version'),
  emberVersionCompatibilities: DS.hasMany('emberVersionCompatibility')
});

import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  succeeded: DS.attr('boolean'),
  statusMessage: DS.attr('string'),
  createdAt: DS.attr('date'),
  canary: DS.attr('boolean'),
  output: DS.attr('string'),
  semverString: DS.attr('string'),

  version: DS.belongsTo('version'),
  emberVersionCompatibilities: DS.hasMany('emberVersionCompatibility', { async: false }),
  testsRunAt: Ember.computed.alias('createdAt')
});

import { readOnly } from '@ember/object/computed';
import DS from 'ember-data';

export default DS.Model.extend({
  succeeded: DS.attr('boolean'),
  statusMessage: DS.attr('string'),
  createdAt: DS.attr('date'),
  canary: DS.attr('boolean'),
  output: DS.attr('string'),
  outputFormat: DS.attr('string'),
  semverString: DS.attr('string'),

  version: DS.belongsTo('version'),
  emberVersionCompatibilities: DS.hasMany('emberVersionCompatibility'),
  testsRunAt: readOnly('createdAt')
});

import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { readOnly } from '@ember/object/computed';

export default Model.extend({
  succeeded: attr('boolean'),
  statusMessage: attr('string'),
  createdAt: attr('date'),
  canary: attr('boolean'),
  output: attr('string'),
  outputFormat: attr('string'),
  semverString: attr('string'),

  version: belongsTo('version'),
  emberVersionCompatibilities: hasMany('emberVersionCompatibility'),
  testsRunAt: readOnly('createdAt')
});

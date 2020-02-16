import { alias } from '@ember/object/computed';
import DS from 'ember-data';

export default DS.Model.extend({
  succeeded: DS.attr('boolean'),
  errorMessage: DS.attr('string'),
  createdAt: DS.attr('date'),
  output: DS.attr('string'),

  version: DS.belongsTo('version'),
  testsRunAt: alias('createdAt'),

  outputFormat: 'json',
});

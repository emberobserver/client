import { readOnly } from '@ember/object/computed';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class TestResult extends Model {
  @attr('boolean')
  succeeded;

  @attr('string')
  statusMessage;

  @attr('date')
  createdAt;

  @attr('boolean')
  canary;

  @attr('string')
  output;

  @attr('string')
  outputFormat;

  @attr('string')
  semverString;

  @belongsTo('version', { async: true, inverse: null })
  version;

  @hasMany('emberVersionCompatibility', { async: true, inverse: null })
  emberVersionCompatibilities;

  @readOnly('createdAt')
  testsRunAt;
}

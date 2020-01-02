import classic from 'ember-classic-decorator';
import { readOnly } from '@ember/object/computed';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

@classic
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

  @belongsTo('version')
  version;

  @hasMany('emberVersionCompatibility')
  emberVersionCompatibilities;

  @readOnly('createdAt')
  testsRunAt;
}

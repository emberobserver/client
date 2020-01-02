import classic from 'ember-classic-decorator';
import Model, { belongsTo, attr } from '@ember-data/model';

@classic
export default class EmberVersionCompatibility extends Model {
  @belongsTo('version')
  version;

  @attr('string')
  emberVersion;

  @attr('boolean')
  compatible;
}

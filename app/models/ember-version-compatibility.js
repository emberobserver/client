import Model, { belongsTo, attr } from '@ember-data/model';

export default class EmberVersionCompatibility extends Model {
  @belongsTo('version', { async: true, inverse: null })
  version;

  @attr('string')
  emberVersion;

  @attr('boolean')
  compatible;
}

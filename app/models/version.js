import Model, { hasMany, belongsTo, attr } from '@ember-data/model';

export default class Version extends Model {
  @attr('string')
  version;

  @attr('string')
  addonName;

  @attr('date')
  released;

  @attr('string')
  emberCliVersion;

  @belongsTo('addon', { inverse: 'versions', async: true })
  addon;

  @belongsTo('review', { async: true, inverse: 'version' })
  review;

  @belongsTo('addon-size', { async: true, inverse: 'addonVersion' })
  addonSize;

  @hasMany('addon-dependency', { async: true, inverse: 'dependentVersion' })
  dependencies;
}

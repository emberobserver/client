import Model, { attr, belongsTo } from '@ember-data/model';

export default class ScoreCalculation extends Model {
  @attr()
  info;

  @belongsTo('addon', { async: true, inverse: null })
  addon;

  @belongsTo('addon-version', { async: true, inverse: null })
  addonVersion;
}

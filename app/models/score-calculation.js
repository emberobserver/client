import classic from 'ember-classic-decorator';
import Model, { attr, belongsTo } from '@ember-data/model';

@classic
export default class ScoreCalculation extends Model {
  @attr()
  info;

  @belongsTo()
  addon;

  @belongsTo()
  addonVersion;
}

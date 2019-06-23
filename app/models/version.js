import classic from 'ember-classic-decorator';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

@classic
export default class VersionEmberObject extends Model {
  @attr
  version;

  @attr
  released;

  @attr
  emberCliVersion;

  @belongsTo
  addon;

  @belongsTo
  review;

  @hasMany
  dependencies;
}

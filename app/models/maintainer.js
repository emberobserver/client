import classic from 'ember-classic-decorator';
import Model, { hasMany, attr } from '@ember-data/model';

@classic
export default class Maintainer extends Model {
  @attr('string')
  name;

  @attr('string')
  gravatar;

  @hasMany('addon', { async: true })
  addons;
}

import classic from 'ember-classic-decorator';
import Model, { hasMany, attr } from '@ember-data/model';

@classic
export default class Keyword extends Model {
  @attr('string')
  keyword;

  @hasMany('addon')
  addons;
}

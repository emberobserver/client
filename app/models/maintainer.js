import Model, { hasMany, attr } from '@ember-data/model';

export default class Maintainer extends Model {
  @attr('string')
  name;

  @attr('string')
  gravatar;

  @hasMany('addon', { async: true, inverse: 'maintainers' })
  addons;
}

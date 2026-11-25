import Model, { attr } from '@ember-data/model';

export default class GithubUser extends Model {
  @attr('string')
  name;

  @attr('string')
  avatarUrl;
}

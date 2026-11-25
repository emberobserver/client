import Model, { attr } from '@ember-data/model';

export default class EmberVersion extends Model {
  @attr('string')
  version;

  @attr('date')
  released;
}

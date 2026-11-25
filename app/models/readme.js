import Model, { attr } from '@ember-data/model';

export default class Readme extends Model {
  @attr('string')
  contents;
}

import Model, { attr, belongsTo } from '@ember-data/model';

export default class extends Model {
  @attr('boolean') succeeded;
  @attr('string') errorMessage;
  @attr('date') createdAt;
  @attr('string') output;

  @belongsTo('version') version;

  get testsRunAt() {
    return this.createdAt;
  }

  outputFormat = 'json';
}

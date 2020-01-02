import classic from 'ember-classic-decorator';
import Model, { attr } from '@ember-data/model';

@classic
export default class EmberVersion extends Model {
  @attr('string')
  version;

  @attr('date')
  released;
}

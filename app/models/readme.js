import classic from 'ember-classic-decorator';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

@classic
export default class ReadmeEmberObject extends Model {
  @attr
  contents;
}

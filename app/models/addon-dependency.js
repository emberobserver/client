import classic from 'ember-classic-decorator';
import { equal } from '@ember/object/computed';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

@classic
export default class AddonDependency extends Model {
  @attr('string')
  package;

  @attr('string')
  dependencyType;

  @belongsTo('version')
  dependentVersion;

  @equal('dependencyType', 'dependencies')
  isDependency;

  @equal('dependencyType', 'devDependencies')
  isDevDependency;
}

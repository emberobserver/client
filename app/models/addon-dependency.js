import classic from 'ember-classic-decorator';
import { equal, readOnly } from '@ember/object/computed';
import Model, { belongsTo, attr } from '@ember-data/model';

@classic
export default class AddonDependency extends Model {
  @attr('string')
  package;

  @attr('string')
  dependencyType;

  @belongsTo('version')
  dependentVersion;

  @belongsTo('addon')
  packageAddon;

  @equal('dependencyType', 'dependencies')
  isDependency;

  @equal('dependencyType', 'devDependencies')
  isDevDependency;

  @readOnly('packageAddon.latestAddonVersion.addonSize')
  addonSize;
}

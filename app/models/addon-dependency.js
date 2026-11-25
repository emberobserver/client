import { equal, readOnly } from '@ember/object/computed';
import Model, { belongsTo, attr } from '@ember-data/model';

export default class AddonDependency extends Model {
  @attr('string')
  package;

  @attr('string')
  dependencyType;

  @belongsTo('version', { async: true, inverse: 'dependencies' })
  dependentVersion;

  @belongsTo('addon', { async: true, inverse: null })
  packageAddon;

  @equal('dependencyType', 'dependencies')
  isDependency;

  @equal('dependencyType', 'devDependencies')
  isDevDependency;

  @readOnly('packageAddon.latestAddonVersion.addonSize')
  addonSize;
}

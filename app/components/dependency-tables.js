import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

const dependencies = (dep) => dep.isDependency;
const devDependencies = (dep) => dep.isDevDependency;

@classic
@tagName('')
export default class DependencyTables extends Component {
  @service
  store;

  addonVersion = null;

  @action
  fetchDependencies(addonVersionId) {
    return this.store.query('addon-dependency', {
      filter: { addonVersionId },
      sort: 'package',
    }).then((results) => {
      return {
        dependencies: results.filter(dependencies).map(dep => dep.package),
        devDependencies: results.filter(devDependencies).map(dep => dep.package)
      };
    });
  }

  @action
  fetchDependents(packageAddonId) {
    return this.store.query('addon-dependency', {
      filter: { packageAddonId },
      include: 'dependent-version',
    }).then((results) => {
      return {
        dependencies: results.filter(dependencies).map(dep => dep.dependentVersion.get('addonName')).sort(),
        devDependencies: results.filter(devDependencies).map(dep => dep.dependentVersion.get('addonName')).sort()
      };
    });
  }
}

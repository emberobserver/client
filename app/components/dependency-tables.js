import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

const dependencies = (dep) => dep.isDependency;
const devDependencies = (dep) => dep.isDevDependency;

export default class DependencyTables extends Component {
  @service
  store;

  @action
  fetchDependencies(addonVersionId) {
    return this.store
      .query('addon-dependency', {
        filter: { addonVersionId },
        include: 'package-addon.latest-addon-version.addon-size',
        sort: 'package',
      })
      .then((results) => {
        return {
          dependencies: results
            .filter(dependencies)
            .map((dep) => dependencyObject(dep)),
          devDependencies: results
            .filter(devDependencies)
            .map((dep) => dependencyObject(dep)),
        };
      });
  }

  @action
  fetchDependents(packageAddonId) {
    return this.store
      .query('addon-dependency', {
        filter: { packageAddonId },
        include: 'dependent-version',
      })
      .then((results) => {
        return {
          dependencies: results
            .filter(dependencies)
            .map((dep) => dependentObject(dep))
            .sortBy('packageName'),
          devDependencies: results
            .filter(devDependencies)
            .map((dep) => dependentObject(dep))
            .sortBy('packageName'),
        };
      });
  }
}

function dependencyObject(dependency) {
  return {
    packageName: dependency.get('package'),
    size: dependency.get('addonSize'),
  };
}

function dependentObject(dependency) {
  return {
    packageName: dependency.get('dependentVersion.addonName'),
    size: null,
  };
}

import Component from '@ember/component';
import { inject as service } from '@ember/service';

const dependencies = (dep) => dep.isDependency;
const devDependencies = (dep) => dep.isDevDependency;

export default Component.extend({
  tagName: '',

  store: service(),

  addonVersion: null,

  actions: {
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
    },

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
});

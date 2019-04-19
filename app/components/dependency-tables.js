import Component from '@ember/component';
import { inject as service } from '@ember/service';

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
          dependencies: results.filter((dep) => dep.isDependency).map((dep) => dep.package),
          devDependencies: results.filter((dep) => dep.isDevDependency).map((dep) => dep.package)
        };
      });
    },

    fetchDependents(packageAddonId) {
      return this.store.query('addon-dependency', {
        filter: { packageAddonId },
        include: 'dependent-version',
      }).then((results) => {
        return {
          dependencies: results.filter(dep => dep.isDependency).map(dep => dep.dependentVersion.get('addonName')).sort(),
          devDependencies: results.filter(dep => dep.isDevDependency).map(dep => dep.dependentVersion.get('addonName')).sort()
        };
      });
    }
  }
});

import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  limit: 8,

  showingAllDependencies: false,

  store: service(),

  init() {
    this._super(...arguments);
    this.get('fetchDependencies').perform();
  },

  fetchDependencies: task(function * () {
    let addonVersionId = this.get('addonVersion.id');
    let results = yield this.store.query('addon-dependency', { filter: { addonVersionId }, sort: 'package' });
    this.set('dependencies',  results.filter((dep) => dep.isDependency));
    this.set('devDependencies',  results.filter((dep) => dep.isDevDependency));
  }),

  addonHasDependencies: computed('dependencies', 'devDependencies', function() {
    return !isEmpty(this.dependencies) || !isEmpty(this.devDependencies);
  }),

  dependencyCount: computed.alias('dependencies.length'),

  devDependencyCount: computed.alias('devDependencies.length'),

  hasManyDependencies: computed('dependencyCount', 'devDependencies', function() {
    if (!this.dependencyCount || !this.devDependencyCount) {
      return false;
    }
    return this.dependencyCount > this.limit || this.devDependencies.length > this.limit;
  }),

  hiddenDependencyCount: computed('dependencyCount', 'showingAllDependencies', function() {
    if (this.showingAllDependencies) {
      return 0;
    }
    return Math.max(this.dependencyCount - this.limit, 0);
  }),

  hiddenDevDependencyCount: computed('devDependencyCount', 'showingAllDependencies', function() {
    if (this.showingAllDependencies) {
      return 0;
    }
    return Math.max(this.devDependencyCount - this.limit, 0);
  }),

  hasHiddenDevDependencies: computed.gt('hiddenDevDependencyCount', 0),

  hasHiddenDependencies: computed.gt('hiddenDependencyCount', 0)
});

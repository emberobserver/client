import Component from '@ember/component';
import { computed } from '@ember/object';
import { task } from 'ember-concurrency';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  classNames: ['addon-dependency-table'],

  limit: 8,

  showingAllDependencies: false,

  collapsed: false,

  init() {
    this._super(...arguments);
    if (!this.collapsed) {
      this.get('loadDependencies').perform();
    }
  },

  loadDependencies: task(function * () {
    let { dependencies, devDependencies } = yield this.fetchData();
    this.set('dependencies',  dependencies);
    this.set('devDependencies',  devDependencies);
    this.set('collapsed', false);
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
    return this.dependencyCount > this.limit || this.devDependencyCount > this.limit;
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

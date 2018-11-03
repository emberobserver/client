import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  limit: 8,

  showingAllDependencies: false,

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

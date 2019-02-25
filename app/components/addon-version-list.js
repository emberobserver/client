import { gt } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  showAll: false,

  showingVersions: computed('versions', 'showAll', function() {
    if (this.get('showAll')) {
      return this.get('versions');
    }
    return (this.get('versions') || []).slice(0, 10);
  }),

  emberVersionDataAfterOldestShowingAddonVersion: computed('emberVersions.[]', 'showingVersions.lastObject', function() {
    let oldestVersionDate = this.get('showingVersions.lastObject.released');
    return this.get('emberVersions').filter(version => version.released > oldestVersionDate);
  }),

  versionsWithComponent: computed('emberVersionDataAfterOldestShowingAddonVersion.[]', 'showingVersions.[]', function() {
    let versions = this.emberVersionDataAfterOldestShowingAddonVersion.map(version => ({ component: 'ember-version-item', version }));
    versions = versions.concat(this.showingVersions.map(version => ({ component: 'addon-version-item', version })));
    return versions.sortBy('version.released').reverse();
  }),

  moreThan10Versions: gt('versions.length', 10),
  thereAreHiddenVersions: computed('moreThan10Versions', 'showAll', function() {
    return this.get('moreThan10Versions') && !this.get('showAll');
  }),
  actions: {
    showAllVersions() {
      this.set('showAll', true);
    }
  }
});

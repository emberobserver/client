import { gt } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  showAll: false,
  emberVersions: service(),
  showingVersions: computed('versions', 'showAll', function() {
    if (this.showAll) {
      return this.versions;
    }
    return (this.versions || []).slice(0, 10);
  }),
  emberVersionDataAfterOldestShowingAddonVersion: computed('emberVersions.versions.[]', 'showingVersions.lastObject', function() {
    let oldestVersionDate = this.get('showingVersions.lastObject.released');
    return this.get('emberVersions.versions').filter(version => version.released > oldestVersionDate);
  }),

  versionsWithMeta: computed('emberVersionDataAfterOldestShowingAddonVersion.[]', 'showingVersions.[]', function() {
    let versions = this.emberVersionDataAfterOldestShowingAddonVersion.map(version => ({ isEmber: true, version }));
    versions = versions.concat(this.showingVersions.map(version => ({ isAddon: true, version })));
    return versions.sortBy('version.released').reverse();
  }),

  moreThan10Versions: gt('versions.length', 10),
  thereAreHiddenVersions: computed('moreThan10Versions', 'showAll', function() {
    return this.moreThan10Versions && !this.showAll;
  }),
  actions: {
    showAllVersions() {
      this.set('showAll', true);
    }
  }
});

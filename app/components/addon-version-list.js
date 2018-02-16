import { gt } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

export default Component.extend({
  showAll: false,
  emberVersions: service(),
  showingVersions: computed('versions', 'showAll', function() {
    if (this.get('showAll')) {
      return this.get('versions');
    }
    return (this.get('versions') || []).slice(0, 10);
  }),
  emberVersionDataAfterOldestShowingAddonVersion: computed('emberVersions.versionData', 'showingVersions.lastObject', function() {
    let oldestVersionDate = this.get('showingVersions.lastObject.released');
    return this.get('emberVersions.versionData').filter(function(version) {
      return version.released > oldestVersionDate;
    });
  }),
  combinedVersions: computed(
    'emberVersionDataAfterOldestShowingAddonVersion',
    'showingVersions',
    function() {
      return (this.get('emberVersionDataAfterOldestShowingAddonVersion') || []).concat(this.get('showingVersions')).sortBy('released').reverse();
    }
  ),
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

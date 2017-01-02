import Ember from 'ember';

export default Ember.Component.extend({
  showAll: false,
  emberVersions: Ember.inject.service(),
  showingVersions: Ember.computed('versions', 'showAll', function() {
    if (this.get('showAll')) {
      return this.get('versions');
    }
    return this.get('versions').slice(0, 10);
  }),
  emberVersionDataAfterOldestShowingAddonVersion: Ember.computed('emberVersions.versionData', 'showingVersions.lastObject', function() {
    let oldestVersionDate = this.get('showingVersions.lastObject.released');
    return this.get('emberVersions.versionData').filter(function(version) {
      return version.released > oldestVersionDate;
    });
  }),
  combinedVersions: Ember.computed(
    'emberVersionDataAfterOldestShowingAddonVersion',
    'showingVersions',
    function() {
      return (this.get('emberVersionDataAfterOldestShowingAddonVersion') || []).concat(this.get('showingVersions')).sortBy('released').reverse();
    }
  ),
  moreThan10Versions: Ember.computed.gt('versions.length', 10),
  thereAreHiddenVersions: Ember.computed('moreThan10Versions', 'showAll', function() {
    return this.get('moreThan10Versions') && !this.get('showAll');
  }),
  actions: {
    showAllVersions() {
      this.set('showAll', true);
    }
  }
});

import Ember from 'ember';

export default Ember.Component.extend({
  showAll: false,
  emberVersions: Ember.inject.service(),
  showingVersions: function() {
    if (this.get('showAll')) {
      return this.get('versions');
    }
    return this.get('versions').slice(0, 10);
  }.property('versions', 'showAll'),
  emberVersionDataAfterOldestShowingAddonVersion: function() {
    let oldestVersionDate = this.get('showingVersions.lastObject.released');
    return this.get('emberVersions.versionData').filter(function(version) {
      return version.released > oldestVersionDate;
    });
  }.property('emberVersions.versionData', 'showingVersions.lastObject'),
  combinedVersions: function() {
    return (this.get('emberVersionDataAfterOldestShowingAddonVersion') || []).concat(this.get('showingVersions')).sortBy('released').reverse();
  }.property('emberVersionDataAfterOldestShowingAddonVersion', 'showingVersions'),
  moreThan10Versions: Ember.computed.gt('versions.length', 10),
  thereAreHiddenVersions: function() {
    return this.get('moreThan10Versions') && !this.get('showAll');
  }.property('moreThan10Versions', 'showAll'),
  actions: {
    showAllVersions() {
      this.set('showAll', true);
    }
  }
});

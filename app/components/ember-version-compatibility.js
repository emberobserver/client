import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  showTable: false,

  versionCompatibilitiesForReleasedVersions: Ember.computed('testResult.emberVersionCompatibilities.@each.emberVersion', function() {
    return this.get('testResult.emberVersionCompatibilities')
      .filter((versionCompatibility) => !versionCompatibility.get('emberVersion').match(/(beta|canary)/));
  }),

  sortedVersionCompatibilities: Ember.computed('versionCompatibilitiesForReleasedVersions.@each.emberVersion', function() {
    return this.get('versionCompatibilitiesForReleasedVersions').toArray().sort(sortByVersion);
  }),

  allTestsPassed: Ember.computed('versionCompatibilitiesForReleasedVersions.@each.compatible', function() {
    return this.get('versionCompatibilitiesForReleasedVersions').every((versionCompatibility) => versionCompatibility.get('compatible'));
  }),

  compatibilitySemverString: Ember.computed('sortedVersionCompatibilities.[]', function() {
    let earliestVersion = this.get('sortedVersionCompatibilities.firstObject.emberVersion');
    let latestVersion = this.get('sortedVersionCompatibilities.lastObject.emberVersion');

    return `>=${earliestVersion} <=${latestVersion}`;
  }),

  actions: {
    toggleShowTable() {
      this.toggleProperty('showTable');
    }
  }
});

function extractVersionParts(versionNumber) {
  let matches = versionNumber.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (matches) {
    return matches.slice(1).map((x) => parseInt(x, 10));
  }
  return null;
}

function sortByVersion(a, b) {
  let [majorA, minorA, patchA] = extractVersionParts(a.get('emberVersion'));
  let [majorB, minorB, patchB] = extractVersionParts(b.get('emberVersion'));

  if (Ember.compare(majorB, majorA) !== 0) {
    return Ember.compare(majorB, majorA);
  }
  if (Ember.compare(minorB, minorA) !== 0) {
    return Ember.compare(minorB, minorA);
  }
  return Ember.compare(patchB, patchA);
}

import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  showTable: false,

  versionCompatibilitiesForReleasedVersions: Ember.computed('testResult.emberVersionCompatibilities.@each.emberVersion', function() {
    return this.get('testResult.emberVersionCompatibilities')
      .filter(versionCompatibility => !versionCompatibility.get('emberVersion').match(/(beta|canary)/));
  }),

  sortedVersionCompatibilities: Ember.computed('versionCompatibilitiesForReleasedVersions.@each.emberVersion', function() {
    return this.get('versionCompatibilitiesForReleasedVersions').toArray().sort(sortByVersion);
  }),

  allTestsPassed: Ember.computed('versionCompatibilitiesForReleasedVersions.@each.compatible', function() {
    return this.get('versionCompatibilitiesForReleasedVersions').every(versionCompatibility => versionCompatibility.get('compatible'));
  }),

  compatibilitySemverString: Ember.computed('sortedVersionCompatibilities.[]', function() {
    let earliestVersion = this.get('sortedVersionCompatibilities.firstObject.emberVersion');
    let latestVersion = this.get('sortedVersionCompatibilities.lastObject.emberVersion');

    return `>=${earliestVersion} <=${latestVersion}`;
  }),

  headerText: Ember.computed('testResult', 'allTestsPassed', function() {
    if (this.get('testResult.succeeded') === false) {
      return 'tests could not be run';
    }
    if (this.get('allTestsPassed')) {
      return 'tests pass in';
    }
    return 'tests run in';
  }),

  actions: {
    toggleShowTable() {
      this.toggleProperty('showTable');
    }
  }
});

function extractVersionParts(versionNumber) {
  var matches = versionNumber.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (matches) {
    return matches.slice(1);
  }
  return null;
}

function sortByVersion(a, b) {
  let [ majorA, minorA, patchA ] = extractVersionParts(a.get('emberVersion'));
  let [ majorB, minorB, patchB ] = extractVersionParts(b.get('emberVersion'));

  if (Ember.compare(majorA, majorB) !== 0) {
    return Ember.compare(majorA, majorB);
  }
  if (Ember.compare(minorA, minorB) !== 0) {
    return Ember.compare(minorA, minorB);
  }
  return Ember.compare(patchA, patchB);
}

import { compare } from '@ember/utils';
import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  showTable: false,

  versionCompatibilitiesForReleasedVersions: computed('testResult.emberVersionCompatibilities.@each.emberVersion', function() {
    return this.get('testResult.emberVersionCompatibilities')
      .filter((versionCompatibility) => !versionCompatibility.get('emberVersion').match(/(beta|canary)/));
  }),

  sortedVersionCompatibilities: computed('versionCompatibilitiesForReleasedVersions.@each.emberVersion', function() {
    return this.get('versionCompatibilitiesForReleasedVersions').toArray().sort(sortByVersion);
  }),

  allTestsPassed: computed('versionCompatibilitiesForReleasedVersions.@each.compatible', function() {
    return this.get('versionCompatibilitiesForReleasedVersions').every((versionCompatibility) => versionCompatibility.get('compatible'));
  }),

  compatibilitySemverString: computed('sortedVersionCompatibilities.[]', function() {
    let earliestVersion = this.get('sortedVersionCompatibilities.lastObject.emberVersion');
    let latestVersion = this.get('sortedVersionCompatibilities.firstObject.emberVersion');

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

  if (compare(majorB, majorA) !== 0) {
    return compare(majorB, majorA);
  }
  if (compare(minorB, minorA) !== 0) {
    return compare(minorB, minorA);
  }
  return compare(patchB, patchA);
}

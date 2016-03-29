import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  versionCompatibilitiesForReleasedVersions: Ember.computed('versionCompatibilities.[]', 'versionCompatibilities.@each.emberVersion', function() {
    return this.get('versionCompatibilities').filter(versionCompatibility => {
      console.dir(versionCompatibility);
      return !versionCompatibility.get('emberVersion').match(/(beta|canary)/);
    });
  }),

  sortedVersionCompatibilities: Ember.computed('versionCompatibilitiesForReleasedVersions.[]', 'versionCompatibilitiesForReleasedVersions.@each.emberVersion', function() {
    return this.get('versionCompatibilitiesForReleasedVersions').toArray().sort(sortByVersion);
  })
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

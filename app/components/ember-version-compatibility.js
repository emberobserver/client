import asArray from 'ember-observer/utils/as-array';
import { get } from '@ember/object';
import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import { compare } from '@ember/utils';
import Component from '@ember/component';

@tagName('')
export default class EmberVersionCompatibility extends Component {
  showTable = false;

  @computed('testResult.emberVersionCompatibilities.@each.emberVersion')
  get versionCompatibilitiesForReleasedVersions() {
    return asArray(this.get('testResult.emberVersionCompatibilities')).filter(
      (versionCompatibility) =>
        !versionCompatibility.get('emberVersion').match(/(beta|canary)/)
    );
  }

  @computed('versionCompatibilitiesForReleasedVersions.@each.emberVersion')
  get sortedVersionCompatibilities() {
    return asArray(this.versionCompatibilitiesForReleasedVersions).slice()
      .sort(sortByVersion);
  }

  @computed('versionCompatibilitiesForReleasedVersions.@each.compatible')
  get allTestsPassed() {
    return this.versionCompatibilitiesForReleasedVersions.every(
      (versionCompatibility) => versionCompatibility.get('compatible')
    );
  }

  @computed(
    'sortedVersionCompatibilities.[]',
    'sortedVersionCompatibilities.firstObject.emberVersion',
    'sortedVersionCompatibilities.lastObject.emberVersion'
  )
  get compatibilitySemverString() {
    let earliestVersion = asArray(get(this, 'sortedVersionCompatibilities')).slice(-1)[0]?.emberVersion;
    let latestVersion = asArray(get(this, 'sortedVersionCompatibilities'))[0]?.emberVersion;

    return `>=${earliestVersion} <=${latestVersion}`;
  }

  @action
  toggleShowTable() {
    this.toggleProperty('showTable');
  }
}

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

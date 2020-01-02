import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import { compare } from '@ember/utils';
import Component from '@ember/component';

@classic
@tagName('')
export default class EmberVersionCompatibility extends Component {
  showTable = false;

  @computed('testResult.emberVersionCompatibilities.@each.emberVersion')
  get versionCompatibilitiesForReleasedVersions() {
    return this.get('testResult.emberVersionCompatibilities')
      .filter((versionCompatibility) => !versionCompatibility.get('emberVersion').match(/(beta|canary)/));
  }

  @computed('versionCompatibilitiesForReleasedVersions.@each.emberVersion')
  get sortedVersionCompatibilities() {
    return this.versionCompatibilitiesForReleasedVersions.toArray().sort(sortByVersion);
  }

  @computed('versionCompatibilitiesForReleasedVersions.@each.compatible')
  get allTestsPassed() {
    return this.versionCompatibilitiesForReleasedVersions.every((versionCompatibility) => versionCompatibility.get('compatible'));
  }

  @computed('sortedVersionCompatibilities.[]')
  get compatibilitySemverString() {
    let earliestVersion = this.get('sortedVersionCompatibilities.lastObject.emberVersion');
    let latestVersion = this.get('sortedVersionCompatibilities.firstObject.emberVersion');

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

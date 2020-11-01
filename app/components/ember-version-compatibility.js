import { action } from '@ember/object';
import { compare } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class EmberVersionCompatibility extends Component {
  @tracked showTable = false;

  get versionCompatibilitiesForReleasedVersions() {
    return this.args.testResult.get('emberVersionCompatibilities')
      .filter((versionCompatibility) => !versionCompatibility.get('emberVersion').match(/(beta|canary)/));
  }

  get sortedVersionCompatibilities() {
    return this.versionCompatibilitiesForReleasedVersions.toArray().sort(sortByVersion);
  }

  get allTestsPassed() {
    return this.versionCompatibilitiesForReleasedVersions.every((versionCompatibility) => versionCompatibility.get('compatible'));
  }

  get compatibilitySemverString() {
    let earliestVersion = this.sortedVersionCompatibilities.get('lastObject.emberVersion');
    let latestVersion = this.sortedVersionCompatibilities.get('firstObject.emberVersion');

    return `>=${earliestVersion} <=${latestVersion}`;
  }

  @action
  toggleShowTable(event) {
    event.preventDefault();
    this.showTable = !this.showTable;
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

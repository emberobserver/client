import asArray from 'ember-observer/utils/as-array';
import { get } from '@ember/object';
import { action } from '@ember/object';
import { compare } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class EmberVersionCompatibility extends Component {
  @tracked
  showTable = false;

  get versionCompatibilitiesForReleasedVersions() {
    return asArray(get(this.args, 'testResult.emberVersionCompatibilities')).filter(
      (versionCompatibility) =>
        !get(versionCompatibility, 'emberVersion').match(/(beta|canary)/)
    );
  }

  get sortedVersionCompatibilities() {
    return asArray(this.versionCompatibilitiesForReleasedVersions).slice()
      .sort(sortByVersion);
  }

  get allTestsPassed() {
    return this.versionCompatibilitiesForReleasedVersions.every(
      (versionCompatibility) => get(versionCompatibility, 'compatible')
    );
  }

  get compatibilitySemverString() {
    let earliestVersion = asArray(get(this, 'sortedVersionCompatibilities')).slice(-1)[0]?.emberVersion;
    let latestVersion = asArray(get(this, 'sortedVersionCompatibilities'))[0]?.emberVersion;

    return `>=${earliestVersion} <=${latestVersion}`;
  }

  @action
  toggleShowTable() {
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
  let [majorA, minorA, patchA] = extractVersionParts(get(a, 'emberVersion'));
  let [majorB, minorB, patchB] = extractVersionParts(get(b, 'emberVersion'));

  if (compare(majorB, majorA) !== 0) {
    return compare(majorB, majorA);
  }
  if (compare(minorB, minorA) !== 0) {
    return compare(minorB, minorA);
  }
  return compare(patchB, patchA);
}

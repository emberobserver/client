import asArray from 'ember-observer/utils/as-array';
import { get } from '@ember/object';
import { action } from '@ember/object';
import { compare } from '@ember/utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import RelativeTime from "./relative-time.gjs";
import { on } from "@ember/modifier";
import EmberVersionCompatibilityList from "./ember-version-compatibility-list.gjs";

export default class EmberVersionCompatibility extends Component {<template><div class="ember-version-compatibility test-ember-version-compatibility-section">
  <h6>ember compatibility</h6>
  {{#if @testResult.succeeded}}
    {{#if this.allTestsPassed}}
      <p>
        <span class="test-ember-version-compatibility-semver-compat">
          All tests pass with Ember {{this.compatibilitySemverString}}
        </span>
        <br>
        <em class="test-ember-version-compatibility-timestamp">
          last ran <RelativeTime @date={{@testResult.testsRunAt}} />
        </em>
      </p>
      {{#if this.showTable}}
        <button type="button" class="info-action test-ember-version-compatibility-show-table btn-link" {{on "click" this.toggleShowTable}}>Hide results</button>
        <EmberVersionCompatibilityList @versionCompatibilities={{this.sortedVersionCompatibilities}} />
      {{else}}
        <button type="button" class="info-action test-ember-version-compatibility-show-table btn-link" {{on "click" this.toggleShowTable}}>Show detailed results</button>
      {{/if}}
    {{else}}
      Tests run against Ember {{this.compatibilitySemverString}} but not all tests passed.
      <br>
      <em class="test-ember-version-compatibility-timestamp">
        last ran <RelativeTime @date={{@testResult.testsRunAt}} />
      </em>
      <EmberVersionCompatibilityList @versionCompatibilities={{this.sortedVersionCompatibilities}} />
    {{/if}}
  {{else}}
    <p>
      <span class="test-ember-version-compatibility-unknown">
        We were unable to run this addon's tests.
      </span>
      <br>
      <em class="test-ember-version-compatibility-timestamp">
        last tried <RelativeTime @date={{@testResult.testsRunAt}} />
      </em>
    </p>
  {{/if}}
</div>
</template>
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

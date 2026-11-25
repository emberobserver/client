import { compare } from '@ember/utils';
import asArray from 'ember-observer/utils/as-array';
import { get } from '@ember/object';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import EmberVersionItem from "./ember-version-item.gjs";
import AddonVersionItem from "./addon-version-item.gjs";
import { on } from "@ember/modifier";

export default class AddonVersionList extends Component {<template><div ...attributes>
<ul class="versions test-addon-versions">
  {{#each this.versionsWithMeta as |version|}}
    <li>
      {{#if version.isEmber}}
        <EmberVersionItem @version={{version.version}} />
      {{else}}
        <AddonVersionItem @version={{version.version}} />
      {{/if}}
    </li>
  {{/each}}
  {{#if this.thereAreHiddenVersions}}
    <button type="button" class="btn-link" {{on "click" this.showAllVersions}}>Show all versions</button>
  {{/if}}
</ul>
</div>
</template>
  @tracked
  showAll = false;

  @service
  emberVersions;

  get showingVersions() {
    if (this.showAll) {
      return this.args.versions;
    }
    return (this.args.versions || []).slice(0, 10);
  }

  get emberVersionDataAfterOldestShowingAddonVersion() {
    let oldestVersionDate = asArray(get(this, 'showingVersions')).slice(-1)[0]?.released;
    return asArray(get(this, 'emberVersions.versions')).filter(
      (version) => version.released > oldestVersionDate
    );
  }

  get versionsWithMeta() {
    let versions = this.emberVersionDataAfterOldestShowingAddonVersion.map(
      (version) => ({ isEmber: true, version })
    );
    versions = versions.concat(
      this.showingVersions.map((version) => ({ isAddon: true, version }))
    );
    return asArray(versions).slice().sort((a, b) => compare(get(a, 'version.released'), get(b, 'version.released'))).reverse();
  }

  get moreThan10Versions() {
    return this.args.versions?.length > 10;
  }

  get thereAreHiddenVersions() {
    return this.moreThan10Versions && !this.showAll;
  }

  @action
  showAllVersions() {
    this.showAll = true;
  }
}

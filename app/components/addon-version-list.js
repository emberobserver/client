import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class AddonVersionList extends Component {
  @tracked showAll = false;

  @service
  emberVersions;

  get showingVersions() {
    if (this.showAll) {
      return this.args.versions;
    }
    return (this.args.versions || []).slice(0, 10);
  }

  get emberVersionDataAfterOldestShowingAddonVersion() {
    let oldestVersion = this.showingVersions[this.showingVersions.length - 1];
    let oldestVersionDate = oldestVersion ? oldestVersion.released : null;
    return this.emberVersions.versions.filter(version => version.released > oldestVersionDate);
  }

  get versionsWithMeta() {
    let versions = this.emberVersionDataAfterOldestShowingAddonVersion.map(version => ({ isEmber: true, version }));
    versions = versions.concat(this.showingVersions.map(version => ({ isAddon: true, version })));
    return versions.sortBy('version.released').reverse();
  }

  get moreThan10Versions() {
    return this.args.versions.length > 10;
  }

  get thereAreHiddenVersions() {
    return this.moreThan10Versions && !this.showAll;
  }

  @action
  showAllVersions(event) {
    event.preventDefault();
    this.showAll = true;
  }
}

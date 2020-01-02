import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { gt } from '@ember/object/computed';
import Component from '@ember/component';

@classic
export default class AddonVersionList extends Component {
  showAll = false;

  @service
  emberVersions;

  @computed('versions', 'showAll')
  get showingVersions() {
    if (this.showAll) {
      return this.versions;
    }
    return (this.versions || []).slice(0, 10);
  }

  @computed('emberVersions.versions.[]', 'showingVersions.lastObject')
  get emberVersionDataAfterOldestShowingAddonVersion() {
    let oldestVersionDate = this.get('showingVersions.lastObject.released');
    return this.get('emberVersions.versions').filter(version => version.released > oldestVersionDate);
  }

  @computed('emberVersionDataAfterOldestShowingAddonVersion.[]', 'showingVersions.[]')
  get versionsWithMeta() {
    let versions = this.emberVersionDataAfterOldestShowingAddonVersion.map(version => ({ isEmber: true, version }));
    versions = versions.concat(this.showingVersions.map(version => ({ isAddon: true, version })));
    return versions.sortBy('version.released').reverse();
  }

  @gt('versions.length', 10)
  moreThan10Versions;

  @computed('moreThan10Versions', 'showAll')
  get thereAreHiddenVersions() {
    return this.moreThan10Versions && !this.showAll;
  }

  @action
  showAllVersions() {
    this.set('showAll', true);
  }
}

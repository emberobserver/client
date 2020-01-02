import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { readOnly, alias } from '@ember/object/computed';
import Controller from '@ember/controller';

@classic
export default class ShowController extends Controller {
  @service
  features;

  @alias('model.addon')
  addon;

  @alias('addon.latestReview')
  latestReview;

  @computed('addon.versions')
  get sortedAddonVersions() {
    return (this.get('addon.versions') || []).sortBy('released').reverse();
  }

  @readOnly('addon.latestAddonVersion')
  latestVersion;

  @computed('latestReview.version.version', 'latestVersion.version')
  get isLatestReviewForLatestVersion() {
    return this.get('latestReview.version.version') === this.get('latestVersion.version');
  }

  @computed('model.latestTestResult.version', 'latestVersion')
  get isTestResultForLatestVersion() {
    return this.get('model.latestTestResult.version.version') === this.get('latestVersion.version');
  }

  @computed('addon.hasInvalidGithubRepo', 'addon.githubStats.firstCommitDate')
  get hasGithubData() {
    return !this.get('addon.hasInvalidGithubRepo') && this.get('addon.githubStats.firstCommitDate');
  }
}

import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { questions } from '../models/review';

@classic
@tagName('')
export default class AdminAddonComponent extends Component {
  @service
  @service
  store;

  addon = null;
  recentlyRenewed = false;

  updateInvalidRepoFlag(value) {
    this.set('addon.hasInvalidGithubRepo', !value);
  }

  updateIsWipFlag(value) {
    this.set('addon.isWip', !value);
  }

  updateIsDeprecatedFlag(value) {
    this.set('addon.isDeprecated', !value);
  }

  updateIsHiddenFlag(value) {
    this.set('addon.isHidden', !value);
  }

  @task
  saveAddon;

  @task
  renewLatestReview;

  @task
  completeRenew;
}

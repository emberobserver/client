import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import Controller from '@ember/controller';

@classic
export default class ShowController extends Controller {
  @service
  api;

  @readOnly('model')
  buildResult;

  @readOnly('buildResult.version')
  addonVersion;

  @readOnly('addonVersion.addon')
  addon;

  hasRetriedBuild = false;

  @computed('buildResult.succeeded', 'buildResult.statusMessage')
  get buildStatus() {
    if (this.get('buildResult.succeeded')) {
      return 'succeeded';
    }
    return this.get('buildResult.statusMessage');
  }

  @computed('buildResult.succeeded', 'hasRetriedBuild')
  get canRetryBuild() {
    return !this.get('buildResult.succeeded') && !this.hasRetriedBuild;
  }

  @action
  retryBuild() {
    this.set('hasRetriedBuild', true);
    this.api.request(`/test_results/${this.get('buildResult.id')}/retry`, { method: 'POST' }).catch((e) => {
      this.get('hasRetriedBuild', false);
      throw e;
    });
  }
}

import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { readOnly } from '@ember/object/computed';

@classic
export default class SizeCalculationResultsShowController extends Controller {
  @service
  api;

  @readOnly('model')
  sizeCalculationResult;

  @readOnly('sizeCalculationResult.version')
  addonVersion;

  @readOnly('addonVersion.addon')
  addon;

  hasRetriedBuild = false;

  @computed('sizeCalculationResult.succeeded', 'sizeCalculationResult.errorMessage')
  get buildStatus() {
    if (this.get('sizeCalculationResult.succeeded')) {
      return 'succeeded';
    }
    return this.get('sizeCalculationResult.errorMessage');
  }

  @computed('sizeCalculationResult.succeeded', 'hasRetriedBuild')
  get canRetryBuild() {
    return !this.get('sizeCalculationResult.succeeded') && !this.get('hasRetriedBuild');
  }

  @action
  retryBuild() {
    this.set('hasRetriedBuild', true);
    this.api.request(`/size_calculation_results/${this.get('sizeCalculationResult.id')}/retry`, { method: 'POST' }).catch((e) => {
      this.get('hasRetriedBuild', false);
      throw e;
    });
  }
}

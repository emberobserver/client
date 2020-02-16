import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  api: service('api'),
  sizeCalculationResult: alias('model'),
  addonVersion: alias('sizeCalculationResult.version'),
  addon: alias('addonVersion.addon'),
  hasRetriedBuild: false,

  buildStatus: computed('sizeCalculationResult.succeeded', 'sizeCalculationResult.errorMessage', function() {
    if (this.get('sizeCalculationResult.succeeded')) {
      return 'succeeded';
    }
    return this.get('sizeCalculationResult.errorMessage');
  }),

  canRetryBuild: computed('sizeCalculationResult.succeeded', 'hasRetriedBuild', function() {
    return !this.get('sizeCalculationResult.succeeded') && !this.get('hasRetriedBuild');
  }),

  actions: {
    retryBuild() {
      this.set('hasRetriedBuild', true);
      this.api.request(`/size_calculation_results/${this.get('sizeCalculationResult.id')}/retry`, { method: 'POST' }).catch((e) => {
        this.get('hasRetriedBuild', false);
        throw e;
      });
    }
  }
});

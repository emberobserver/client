import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { readOnly } from '@ember/object/computed';

export default Controller.extend({
  ajax: service('apiAjax'),
  buildResult: readOnly('model'),
  addonVersion: readOnly('buildResult.version'),
  addon: readOnly('addonVersion.addon'),
  hasRetriedBuild: false,

  buildStatus: computed('buildResult.succeeded', 'buildResult.statusMessage', function() {
    if (this.get('buildResult.succeeded')) {
      return 'succeeded';
    }
    return this.get('buildResult.statusMessage');
  }),

  canRetryBuild: computed('buildResult.succeeded', 'hasRetriedBuild', function() {
    return !this.get('buildResult.succeeded') && !this.get('hasRetriedBuild');
  }),

  actions: {
    retryBuild() {
      this.set('hasRetriedBuild', true);
      this.get('ajax').post(`test_results/${this.get('buildResult.id')}/retry`).catch(() => this.get('hasRetriedBuild', false));
    }
  }
});

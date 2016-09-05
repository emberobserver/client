import Ember from 'ember';

const { computed: { alias } } = Ember;

export default Ember.Controller.extend({
  ajax: Ember.inject.service('apiAjax'),
  buildResult: alias('model'),
  addonVersion: alias('buildResult.version'),
  addon: alias('addonVersion.addon'),
  hasRetriedBuild: false,

  buildStatus: Ember.computed('buildResult.succeeded', 'buildResult.statusMessage', function() {
    if (this.get('buildResult.succeeded')) {
      return 'succeeded';
    }
    return this.get('buildResult.statusMessage');
  }),

  canRetryBuild: Ember.computed('buildResult.succeeded', 'hasRetriedBuild', function() {
    return !this.get('buildResult.succeeded') && !this.get('hasRetriedBuild');
  }),

  actions: {
    retryBuild() {
      this.set('hasRetriedBuild', true);
      this.get('ajax').post(`test_results/${this.get('buildResult.id')}/retry`).catch(() => this.get('hasRetriedBuild', false));
    }
  }
});

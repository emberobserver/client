import Ember from 'ember';

const { computed: { alias } } = Ember;

export default Ember.Controller.extend({
  buildResult: alias('model'),
  addonVersion: alias('buildResult.version'),
  addon: alias('addonVersion.addon'),

  buildStatus: Ember.computed('buildResult.succeeded', 'buildResult.statusMessage', function() {
    if (this.get('buildResult.succeeded')) {
      return 'succeeded';
    }
    return this.get('buildResult.statusMessage');
  })
});

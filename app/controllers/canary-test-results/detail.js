import Ember from 'ember';

export default Ember.Controller.extend({
  testResult: Ember.computed.alias('model'),
  addonVersion: Ember.computed.alias('testResult.version'),
  addon: Ember.computed.alias('addonVersion.addon')
});

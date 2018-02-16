import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  testResult: alias('model'),
  addonVersion: alias('testResult.version'),
  addon: alias('addonVersion.addon')
});

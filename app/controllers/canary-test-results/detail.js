import { readOnly } from '@ember/object/computed';
import Controller from '@ember/controller';

export default Controller.extend({
  testResult: readOnly('model'),
  addonVersion: readOnly('testResult.version'),
  addon: readOnly('addonVersion.addon')
});

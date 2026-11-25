import { readOnly } from '@ember/object/computed';
import Controller from '@ember/controller';

export default class DetailController extends Controller {
  @readOnly('model')
  testResult;

  @readOnly('testResult.version')
  addonVersion;

  @readOnly('addonVersion.addon')
  addon;
}

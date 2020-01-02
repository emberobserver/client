import classic from 'ember-classic-decorator';
import { readOnly } from '@ember/object/computed';
import Controller from '@ember/controller';

@classic
export default class DetailController extends Controller {
  @readOnly('model')
  testResult;

  @readOnly('testResult.version')
  addonVersion;

  @readOnly('addonVersion.addon')
  addon;
}

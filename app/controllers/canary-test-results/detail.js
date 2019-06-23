import classic from 'ember-classic-decorator';
import { alias } from '@ember/object/computed';
import Controller from '@ember/controller';

@classic
export default class DetailController extends Controller {
  @alias('model')
  testResult;

  @alias('testResult.version')
  addonVersion;

  @alias('addonVersion.addon')
  addon;
}

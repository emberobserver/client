import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

@classic
export default class AddonSizeEmberObject extends Model {
  @attr
  appJsSize;

  @attr
  appCssSize;

  @attr
  vendorJsSize;

  @attr
  vendorCssSize;

  @attr
  otherJsSize;

  @attr
  otherCssSize;

  @belongsTo
  addonVersion;

  @computed('appJsSize', 'vendorJsSize', 'otherJsSize')
  get totalJsSize() {
    return this.appJsSize + this.vendorJsSize + this.otherJsSize;
  }

  @computed('appCssSize', 'vendorCssSize', 'otherJCssSize')
  get totalCssSize() {
    return this.appCssSize + this.vendorCssSize + this.otherCssSize;
  }
}

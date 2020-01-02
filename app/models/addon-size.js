import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

@classic
export default class AddonSize extends Model {
  @attr('number')
  appJsSize;

  @attr('number')
  appCssSize;

  @attr('number')
  vendorJsSize;

  @attr('number')
  vendorCssSize;

  @attr('number')
  otherJsSize;

  @attr('number')
  otherCssSize;

  @belongsTo('version')
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

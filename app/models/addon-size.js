import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Model, { belongsTo, attr } from '@ember-data/model';
import normalizeFingerprintedAsset from 'ember-observer/utils/normalize-fingerprinted-asset';

@classic
export default class AddonSize extends Model {
  @attr('number')
  appJsSize;

  @attr('number')
  appCssSize;

  @attr('number')
  appJsGzipSize;

  @attr('number')
  appCssGzipSize;

  @attr('number')
  vendorJsSize;

  @attr('number')
  vendorCssSize;

  @attr('number')
  vendorJsGzipSize;

  @attr('number')
  vendorCssGzipSize;

  @attr('number')
  otherJsSize;

  @attr('number')
  otherCssSize;

  @attr('number')
  otherJsGzipSize;

  @attr('number')
  otherCssGzipSize;

  @attr()
  otherAssets;

  @belongsTo('version')
  addonVersion;

  @computed('otherJsSize', 'otherCssSize')
  get otherAssetsSize() {
    return this.otherJsSize + this.otherCssSize;
  }

  @computed('otherJsGzipSize', 'otherCssGzipSize')
  get otherAssetsGzipSize() {
    return this.otherJsGzipSize + this.otherCssGzipSize;
  }

  @computed('appJsSize', 'vendorJsSize', 'otherJsSize')
  get totalJsSize() {
    return this.appJsSize + this.vendorJsSize + this.otherJsSize;
  }

  @computed('appJsGzipSize', 'vendorJsGzipSize', 'otherJsGzipSize')
  get totalJsGzipSize() {
    return this.appJsGzipSize + this.vendorJsGzipSize + this.otherJsGzipSize;
  }

  @computed('appCssSize', 'otherCssSize', 'otherJCssSize', 'vendorCssSize')
  get totalCssSize() {
    return this.appCssSize + this.vendorCssSize + this.otherCssSize;
  }

  @computed('appCssGzipSize', 'vendorCssGzipSize', 'otherCssGzipSize')
  get totalCssGzipSize() {
    return this.appCssGzipSize + this.vendorCssGzipSize + this.otherCssGzipSize;
  }

  @computed('totalJsSize', 'totalCssSize')
  get totalSize() {
    return this.totalJsSize + this.totalCssSize;
  }

  @computed('totalJsGzipSize', 'totalCssGzipSize')
  get totalGzipSize() {
    return this.totalJsGzipSize + this.totalCssGzipSize;
  }

  @computed('otherAssets.files.length')
  get hasOtherAssetsFiles() {
    return this.otherAssets.files && this.otherAssets.files.length > 0;
  }

  @computed('otherAssets.files')
  get normalizedOtherAssetFiles() {
    return this.otherAssets.files.map(function (f) {
      return {
        name: normalizeFingerprintedAsset(f.name),
        size: f.size,
        gzipSize: f.gzipSize,
      };
    });
  }
}

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action, get } from '@ember/object';

export default class DependencySizeComponent extends Component {
  @tracked isViewingDetails;
  @tracked isViewingOtherAssets;
  @tracked addonSize;

  get shouldShow() {
    let addonSize = this.args.addonSize;
    return addonSize && get(addonSize, 'totalSize') > 0;
  }

  @action
  toggleDetail(e) {
    e.preventDefault();
    this.isViewingDetails = !this.isViewingDetails;
    if (!this.isViewingDetails) {
      this.isViewingOtherAssets = false;
    }
  }

  @action
  toggleOtherAssets(e) {
    e.preventDefault();
    this.isViewingOtherAssets = !this.isViewingOtherAssets;
  }
}

import { action, get } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class StatsBar extends Component {
  @tracked
  showBadgeText = false;

  get licenseUrl() {
    return `https://spdx.org/licenses/${get(this.args, 'addon.license')}`;
  }

  get installCommandText() {
    return `ember install ${get(this.args, 'addon.name')}`;
  }

  @action
  toggleBadgeText() {
    this.showBadgeText = !this.showBadgeText;
  }
}

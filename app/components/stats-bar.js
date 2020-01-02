import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import Component from '@ember/component';

@classic
export default class StatsBar extends Component {
  showBadgeText = false;

  @computed('addon.license')
  get licenseUrl() {
    return `https://spdx.org/licenses/${this.get('addon.license')}`;
  }

  @computed('addon.name')
  get installCommandText() {
    return `ember install ${this.get('addon.name')}`;
  }

  @action
  toggleBadgeText() {
    this.toggleProperty('showBadgeText');
  }
}

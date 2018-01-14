import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  showBadgeText: false,
  badgeSrc: computed('addon.name', function() {
    return `https://emberobserver.com/badges/${this.get('addon.name')}.svg`;
  }),
  badgeText: computed('addon.name', function() {
    return `[![Ember Observer Score](https://emberobserver.com/badges/${this.get('addon.name')}.svg)](https://emberobserver.com/addons/${this.get('addon.name')})`;
  }),
  licenseUrl: computed('addon.license', function() {
    return `https://spdx.org/licenses/${this.get('addon.license')}`;
  }),
  installCommandText: computed('addon.name', function() {
    return `ember install ${this.get('addon.name')}`;
  }),
  actions: {
    toggleBadgeText() {
      this.toggleProperty('showBadgeText');
    }
  }
});

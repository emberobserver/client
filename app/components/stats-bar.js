import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  showBadgeText: false,
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

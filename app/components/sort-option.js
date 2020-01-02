import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  isSelected: computed('selectedSort', 'key', function() {
    return this.selectedSort === this.key;
  }),
  actions: {
    sortBy(key) {
      this.sendAction('sortBy', key);
    }
  }
});

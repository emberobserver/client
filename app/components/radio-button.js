import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',
  isSelected: computed('selected', 'option', function() {
    let selected = this.get('selected');
    let opt = this.get('option');
    if (!selected) {
      return false;
    }
    return opt.value === selected.value;
  }),
  actions: {
    select(option) {
      this.sendAction('action', option);
    }
  }
});

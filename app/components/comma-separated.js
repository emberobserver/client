import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',
  separator: computed('list.lastObject', 'item', function() {
    if (this.get('list.lastObject') === this.item) {
      return '';
    } else {
      return ', ';
    }
  })
});

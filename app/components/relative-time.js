import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'time',
  attributeBindings: ['isoDate:datetime', 'isoDate:title'],

  date: null,
  isoDate: computed('date', function() {
    let date = this.get('date');
    return date ? date.toISOString() : null;
  })
});

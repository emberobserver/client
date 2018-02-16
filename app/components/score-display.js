import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  hasNumericScore: computed('addon.score', function() {
    let score = this.get('addon.score');
    return typeof(score) === 'number';
  })
});

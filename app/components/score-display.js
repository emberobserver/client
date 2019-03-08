import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  hasBeenReviewedAndScored: computed('addon.{score,hasBeenReviewed}', function() {
    let score = this.get('addon.score');
    return typeof(score) === 'number' && this.get('addon.hasBeenReviewed');
  })
});

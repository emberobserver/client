import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['build-output'],

  commandGroups: computed('formattedOutput', function() {
    try {
      return JSON.parse(this.formattedOutput);
    } catch(e) {
      return [];
    }
  }),
});

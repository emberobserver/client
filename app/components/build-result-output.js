import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Component.extend({
  isJsonFormat: computed('buildResult.output', function() {
    try {
      JSON.parse(this.buildResult.output);
      return true;
    }
    catch (e) {
      return false;
    }
  }),

  parsedJSON: computed('buildResult.output', function() {
    return JSON.parse(this.buildResult.output);
  }),

  groups: alias('parsedJSON')
});

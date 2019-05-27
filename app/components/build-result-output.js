import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias, equal } from '@ember/object/computed';

export default Component.extend({
  isJsonFormat: equal('buildResult.outputFormat', 'json'),

  parsedJSON: computed('buildResult.output', function() {
    return JSON.parse(this.buildResult.output);
  }),

  groups: alias('parsedJSON')
});

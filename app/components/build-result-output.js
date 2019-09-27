import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal, readOnly } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  isJsonFormat: equal('buildResult.outputFormat', 'json'),

  parsedJSON: computed('buildResult.output', function() {
    return JSON.parse(this.buildResult.output);
  }),

  groups: readOnly('parsedJSON')
});

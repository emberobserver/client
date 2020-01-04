import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  statusText: computed('testResult.succeeded', 'testResult.emberVersionCompatibilities.firstObject.compatible', function() {
    if (this.get('testResult.succeeded')) {
      if (this.get('testResult.emberVersionCompatibilities.firstObject.compatible')) {
        return 'Passed';
      } else {
        return 'Failed';
      }
    } else {
      return 'Error';
    }
  }),

  statusDetail: computed('testResult.succeeded', 'testResult.statusMessage', function() {
    if (!this.get('testResult.succeeded')) {
      return this.get('testResult.statusMessage') || 'unknown';
    }
    return null;
  })
});

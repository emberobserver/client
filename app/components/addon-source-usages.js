import Ember from 'ember';
import { task } from 'ember-concurrency';

const { computed } = Ember;

export default Ember.Component.extend({
  visibleUsageCount: 25,

  showUsages: false,

  usages: null,

  regex: false,

  codeSearch: Ember.inject.service(),

  visibleUsages: computed('visibleUsageCount', 'usages', function() {
    return this.get('usages').slice(0, this.get('visibleUsageCount'));
  }),

  moreUsages: computed('visibleUsageCount', 'usages', function() {
    return this.get('visibleUsageCount') < this.get('usages.length');
  }),

  fetchUsages: task(function* () {
    let usages = yield this.get('codeSearch').usages(this.get('addon.name'), this.get('query'), this.get('regex'));
    this.set('usages', usages);
  }).drop(),

  actions: {
    toggleUsages() {
      this.toggleProperty('showUsages');
      if (this.get('showUsages') && this.get('usages') === null) {
        this.get('fetchUsages').perform();
      }
    },

    viewMore() {
      let newUsageCount = this.get('visibleUsageCount') + 25;
      this.set('visibleUsageCount', newUsageCount);
    }
  }
});

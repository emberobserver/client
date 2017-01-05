import Ember from 'ember';
import { task } from 'ember-concurrency';

const { computed } = Ember;

export default Ember.Component.extend({
  visibleUsageCount: 25,

  showUsages: false,

  usages: null,

  codeSearch: Ember.inject.service(),

  visibleUsages: computed('visibleUsageCount', 'usages', function() {
    return this.get('usages').slice(0, this.get('visibleUsageCount'));
  }),

  moreUsages: computed('visibleUsageCount', 'usages', function() {
    return this.get('visibleUsageCount') < this.get('usages.length');
  }),

  toggleUsages: task(function* () {
    if (this.get('usages') === null) {
      let usages = yield this.get('codeSearch').usages(this.get('addon.name'), this.get('query'));
      this.set('usages', usages);
    }
    this.toggleProperty('showUsages');
  }).restartable(),

  actions: {
    viewMore() {
      let newUsageCount = this.get('visibleUsageCount') + 25;
      this.set('visibleUsageCount', newUsageCount);
    }
  }
});

import Ember from 'ember';
import { task } from 'ember-concurrency';

const {
  computed,
  inject,
  isEmpty
} = Ember;

export default Ember.Component.extend({
  visibleUsageCount: 25,

  showUsages: false,

  usages: null,

  regex: false,

  fileFilter: null,

  codeSearch: inject.service(),

  visibleUsages: computed('visibleUsageCount', 'usages', function() {
    return this.get('usages').slice(0, this.get('visibleUsageCount'));
  }),

  moreUsages: computed('visibleUsageCount', 'usages', function() {
    return this.get('visibleUsageCount') < this.get('usages.length');
  }),

  fetchUsages: task(function* () {
    let usages = yield this.get('codeSearch').usages(this.get('addon.name'), this.get('query'), this.get('regex'));
    this.set('usages', filterByFilePath(usages, this.get('fileFilter')));
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

function filterByFilePath(usages, filterTerm) {
  if (isEmpty(filterTerm)) {
    return usages;
  }
  let filterRegex = new RegExp(filterTerm);
  return usages.filter((usage) => {
    return usage.filename.match(filterRegex);
  });
}

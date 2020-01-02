import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { task } from 'ember-concurrency';

export default Component.extend({
  visibleUsageCount: 25,

  showUsages: false,

  usages: null,

  regex: false,

  fileFilter: null,

  codeSearch: service(),

  visibleUsages: computed('visibleUsageCount', 'usages', function() {
    return this.usages.slice(0, this.visibleUsageCount);
  }),

  moreUsages: computed('visibleUsageCount', 'usages', function() {
    return this.visibleUsageCount < this.get('usages.length');
  }),

  fetchUsages: task(function* () {
    let usages = yield this.get('codeSearch.usages').perform(this.get('addon.id'), this.query, this.regex);
    this.set('usages', filterByFilePath(usages, this.fileFilter));
  }).drop(),

  actions: {
    toggleUsages() {
      this.toggleProperty('showUsages');
      if (this.showUsages && this.usages === null) {
        this.fetchUsages.perform();
      }
    },

    viewMore() {
      let newUsageCount = this.visibleUsageCount + 25;
      this.set('visibleUsageCount', newUsageCount);
    }
  }
});

function filterByFilePath(usages, filterTerm) {
  if (isEmpty(filterTerm)) {
    return usages;
  }
  let filterRegex;
  try {
    filterRegex = new RegExp(filterTerm);
  } catch(e) {
    return [];
  }
  return usages.filter((usage) => {
    return usage.filename.match(filterRegex);
  });
}

import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { task } from 'ember-concurrency';

@classic
export default class AddonSourceUsages extends Component {
  visibleUsageCount = 25;
  showUsages = false;
  usages = null;
  regex = false;
  fileFilter = null;

  @service
  codeSearch;

  @computed('visibleUsageCount', 'usages')
  get visibleUsages() {
    return this.usages.slice(0, this.visibleUsageCount);
  }

  @computed('visibleUsageCount', 'usages')
  get moreUsages() {
    return this.visibleUsageCount < this.get('usages.length');
  }

  @(task(function* () {
    let usages = yield this.get('codeSearch.usages').perform(this.get('addon.id'), this.query, this.regex);
    this.set('usages', filterByFilePath(usages, this.fileFilter));
  }).drop())
  fetchUsages;

  @action
  toggleUsages() {
    this.toggleProperty('showUsages');
    if (this.showUsages && this.usages === null) {
      this.fetchUsages.perform();
    }
  }

  @action
  viewMore() {
    let newUsageCount = this.visibleUsageCount + 25;
    this.set('visibleUsageCount', newUsageCount);
  }
}

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

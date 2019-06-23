import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { task } from 'ember-concurrency';

@classic
export default class AddonSourceUsagesComponent extends Component {
  visibleUsageCount = 25;
  showUsages = false;
  usages = null;
  regex = false;
  fileFilter = null;

  @service
  @service
  codeSearch;

  @computed('visibleUsageCount', 'usages')
  get visibleUsages() {
    return this.get('usages').slice(0, this.get('visibleUsageCount'));
  }

  @computed('visibleUsageCount', 'usages')
  get moreUsages() {
    return this.get('visibleUsageCount') < this.get('usages.length');
  }

  @task
  fetchUsages;

  @action
  toggleUsages() {
    this.toggleProperty('showUsages');
    if (this.get('showUsages') && this.get('usages') === null) {
      this.get('fetchUsages').perform();
    }
  }

  @action
  viewMore() {
    let newUsageCount = this.get('visibleUsageCount') + 25;
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

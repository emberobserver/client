import { action, get } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { isEmpty } from '@ember/utils';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export default class AddonSourceUsages extends Component {
  @tracked
  visibleUsageCount = 25;

  @tracked
  showUsages = false;

  @tracked
  usages = null;

  get regex() {
    return this.args.regex ?? false;
  }

  get fileFilter() {
    return this.args.fileFilter;
  }

  @service
  codeSearch;

  get visibleUsages() {
    return this.usages.slice(0, this.visibleUsageCount);
  }

  get moreUsages() {
    return this.visibleUsageCount < get(this, 'usages.length');
  }

  @(task(function* () {
    let usages = yield get(this, 'codeSearch.usages').perform(
      get(this.args, 'addon.id'),
      this.args.query,
      this.regex
    );
    this.usages = filterByFilePath(usages, this.fileFilter);
  }).drop())
  fetchUsages;

  @action
  toggleUsages() {
    this.showUsages = !this.showUsages;
    if (this.showUsages && this.usages === null) {
      this.fetchUsages.perform();
    }
  }

  @action
  viewMore() {
    let newUsageCount = this.visibleUsageCount + 25;
    this.visibleUsageCount = newUsageCount;
  }
}

function filterByFilePath(usages, filterTerm) {
  if (isEmpty(filterTerm)) {
    return usages;
  }
  let filterRegex;
  try {
    filterRegex = new RegExp(filterTerm);
  } catch (e) {
    return [];
  }
  return usages.filter((usage) => {
    return usage.filename.match(filterRegex);
  });
}

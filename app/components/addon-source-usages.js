import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { isEmpty } from '@ember/utils';
import { dropTask } from 'ember-concurrency-decorators';
import { tracked } from '@glimmer/tracking';

export default class AddonSourceUsages extends Component {
  @tracked showUsages = false;
  @tracked usages = null;
  @tracked visibleUsageCount = 25;

  @service codeSearch;

  get visibleUsages() {
    return this.usages.slice(0, this.visibleUsageCount);
  }

  get moreUsages() {
    return this.visibleUsageCount < this.usages.length;
  }

  @dropTask
  *fetchUsages() {
    let usages = yield this.codeSearch.usages.perform(this.args.addon.id, this.args.query, this.args.regex);
    this.usages = filterByFilePath(usages, this.args.fileFilter);
  }

  @action
  toggleUsages(event) {
    event.preventDefault();
    this.showUsages = !this.showUsages;
    if (this.showUsages && this.usages === null) {
      this.fetchUsages.perform();
    }
  }

  @action
  viewMore(event) {
    event.preventDefault();
    this.visibleUsageCount = this.visibleUsageCount + 25;
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

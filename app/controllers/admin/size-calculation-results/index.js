import asArray from 'ember-observer/utils/as-array';
import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default class SizeCalculationResultsIndexController extends Controller {
  queryParams = ['date'];

  @computed('model')
  get sortedSizeCalculationResults() {
    return asArray(this.model).slice().sort(sortByAddonNameAndMostRecent);
  }
}

function sortByAddonNameAndMostRecent(a, b) {
  let addonName1 = a.get('version.addonName');
  let addonName2 = b.get('version.addonName');

  if (addonName1 < addonName2) {
    return -1;
  }
  if (addonName1 > addonName2) {
    return 1;
  }
  return b.get('createdAt') - a.get('createdAt');
}

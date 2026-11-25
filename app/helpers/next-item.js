import asArray from 'ember-observer/utils/as-array';
import { helper } from '@ember/component/helper';

export function nextItem([arr, item] /*, hash*/) {
  let ind = (arr || []).indexOf(item);
  if (ind >= 0 && ind < arr.get('length') - 1) {
    return asArray(arr)[ind + 1];
  }
}

export default helper(nextItem);

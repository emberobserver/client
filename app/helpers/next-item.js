import { helper } from '@ember/component/helper';

export function nextItem([arr, item]/*, hash*/) {
  let ind = (arr || []).indexOf(item);
  if (ind >= 0 && ind < arr.get('length') - 1) {
    return arr.objectAt(ind + 1);
  }
}

export default helper(nextItem);

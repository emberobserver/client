import { helper } from '@ember/component/helper';

export function previousItem([arr, item]/*, hash*/) {
  let ind = (arr || []).indexOf(item);
  if (ind > 0) {
    return arr.objectAt(ind - 1);
  }
}

export default helper(previousItem);

import { helper } from '@ember/component/helper';

export function includes([arr, item]/*, hash*/) {
  return (arr || []).includes(item);
}

export default helper(includes);

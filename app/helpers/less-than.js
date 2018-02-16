import { helper } from '@ember/component/helper';

export function lessThan([a, b]/* , hash*/) {
  return a < b;
}

export default helper(lessThan);

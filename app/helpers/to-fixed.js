import { helper } from '@ember/component/helper';

export function toFixed([num, digits = 0]/*, hash*/) {
  return num.toFixed(digits);
}

export default helper(toFixed);

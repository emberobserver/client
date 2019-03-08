import { helper } from '@ember/component/helper';

export function scoreComponentColor([proportion]/*, hash*/) {
  if (proportion === 1) {
    return "green";
  }
  if (proportion < 0.5) {
    return "red"
  }
  if (proportion >= 0.5) {
    return "yellow"
  }
}

export default helper(scoreComponentColor);

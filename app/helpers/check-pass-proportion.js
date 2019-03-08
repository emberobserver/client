import { helper } from '@ember/component/helper';

export function checkPassProportion([check]/*, hash*/) {
  return +((check.contribution / check.maxContribution).toFixed(2));
}

export default helper(checkPassProportion);

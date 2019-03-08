import { helper } from '@ember/component/helper';

const MAX_SCORE = 10;

export function formatScoreContribution([contribution]/*, hash*/) {
  return contribution * MAX_SCORE
}

export default helper(formatScoreContribution);

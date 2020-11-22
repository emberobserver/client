import { helper } from '@ember/component/helper';
import { isEmpty } from '@ember/utils';

export function formatBytes([number]/*, hash*/) {
  if (isEmpty(number)) {
    return '';
  }
  if (number >= Math.pow(1024, 3)) {
    return format(number, Math.pow(1024, 3), 'GB');
  }
  if (number >= Math.pow(1024, 2)) {
    return format(number, Math.pow(1024, 2), 'MB');
  }
  if (number >= 1024) {
    return format(number, 1024, 'KB');
  }
  return `${number} B`;
}

function format(number, denominator, unit) {
  return `${parseFloat((number / denominator).toFixed(2))} ${unit}`
}

export default helper(formatBytes);

import { helper } from '@ember/component/helper';

export function commify([number]) {
  if (!number) {
    return '0';
  }
  return number.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

export default helper(commify);

import { helper } from '@ember/component/helper';

export function isEqual(params) {
  return params[0] === params[1];
}

export default helper(isEqual);

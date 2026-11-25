import { get } from '@ember/object';
import asArray from 'ember-observer/utils/as-array';
import { helper } from '@ember/component/helper';

export function padLineNumber([numberToPad, lines]) {
  let maxLineNumber = asArray(lines).map((item) => get(item, 'number')).pop();

  return numberToPad.toString().padEnd(maxLineNumber.toString().length, ' ');
}

export default helper(padLineNumber);

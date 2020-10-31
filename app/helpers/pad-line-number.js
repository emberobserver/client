import { helper } from '@ember/component/helper';

export function padLineNumber([numberToPad, lines]) {
  let maxLineNumber = lines.mapBy('number').pop();

  return numberToPad.toString().padEnd(maxLineNumber.toString().length, ' ');
}

export default helper(padLineNumber);

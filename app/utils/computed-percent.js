import { computed, get } from '@ember/object';

export default function computedPercent(dividendName, divisorName) {
  return computed(dividendName, divisorName, function () {
    let divisor = get(this, divisorName);
    if (!divisor) {
      return null;
    }
    return (get(this, dividendName) / divisor) * 100;
  });
}

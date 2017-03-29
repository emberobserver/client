import Ember from 'ember';

export default function computedPercent(dividendName, divisorName) {
  return Ember.computed(dividendName, divisorName, function() {
    let divisor = this.get(divisorName);
    if (!divisor) {
      return null;
    }
    return (this.get(dividendName) / divisor) * 100;
  });
}

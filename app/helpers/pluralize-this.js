import Ember from 'ember';

export function pluralizeThis([count, singular, plural]/* , hash*/) {
  let pluralized = plural || `${singular}s`;
  if (count === 1) {
    return `1 ${singular}`;
  }
  return `${count} ${pluralized}`;
}

export default Ember.Helper.helper(pluralizeThis);

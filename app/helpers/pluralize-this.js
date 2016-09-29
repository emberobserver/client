import Ember from 'ember';

export function pluralizeThis(params/*, hash*/) {
  let count = params[0] || 0;
  let singular = params[1];
  let plural = params[2] || singular + 's';
  if (count === 1) { return '1 ' + singular; }
  return count + ' ' + plural;
}

export default Ember.Helper.helper(pluralizeThis);

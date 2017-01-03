import Ember from 'ember';

export function lessThan([a, b]/* , hash*/) {
  return a < b;
}

export default Ember.Helper.helper(lessThan);

import Ember from 'ember';

export default Ember.Helper.helper(function pluralize(params) {
  let count = params[0] || 0;
  let singular = params[1];

  if (count > 1) {
    return Ember.Inflector.inflector.pluralize(singular);
  }
  return singular;
});

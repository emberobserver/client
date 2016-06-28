import Ember from 'ember';
import { pluralize } from 'ember-inflector';

export default Ember.Helper.helper(function pluralizeHelper(params) {
  let count = params[0] || 0;
  let singular = params[1];

  if (count > 1) {
    return pluralize(singular);
  }
  return singular;
});

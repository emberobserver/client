import Ember from 'ember';
import { pluralize } from 'ember-inflector';

export default Ember.Helper.helper(function pluralizeHelper([count, singular]) {
  if (count > 1) {
    return pluralize(singular);
  }
  return singular;
});

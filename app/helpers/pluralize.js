import { helper } from '@ember/component/helper';
import { pluralize } from 'ember-inflector';

export default helper(function pluralizeHelper([count, singular]) {
  if (count > 1) {
    return pluralize(singular);
  }
  return singular;
});

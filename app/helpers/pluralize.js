import { helper } from '@ember/component/helper';
import { pluralize } from '@warp-drive/utilities/string';

export default helper(function pluralizeHelper([count, singular]) {
  if (count > 1) {
    return pluralize(singular);
  }
  return singular;
});

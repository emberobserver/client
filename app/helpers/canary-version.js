import asArray from 'ember-observer/utils/as-array';
import { get } from '@ember/object';
import { helper } from '@ember/component/helper';

export default helper(function canaryVersion([testResult]) {
  let version = asArray(get(testResult, 'emberVersionCompatibilities'))[0]
    ?.emberVersion;
  if (!version) {
    return 'an unknown version';
  }
  let matches = version.match(/-(null|canary)\+(.+)$/);
  if (matches && matches.length > 0) {
    return matches[2];
  }
  return 'an unknown version';
});

import { helper } from '@ember/component/helper';

export default helper(function canaryVersion([testResult]) {
  let version = testResult.get('emberVersionCompatibilities.firstObject.emberVersion');
  if (!version) {
    return 'an unknown version';
  }
  let matches = version.match(/-(null|canary)\+(.+)$/);
  if (matches && matches.length > 0) {
    return matches[2];
  }
  return 'an unknown version';
});

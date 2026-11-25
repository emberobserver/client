import asArray from 'ember-observer/utils/as-array';
import { get } from '@ember/object';
import { helper } from '@ember/component/helper';

export default helper(function testResultStatusClass([testResult]) {
  if (testResult.get('succeeded')) {
    if (asArray(get(testResult, 'emberVersionCompatibilities'))[0]?.compatible) {
      return 'passed';
    } else {
      return 'failed';
    }
  } else {
    return 'error';
  }
});

import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  scenarios: readOnly('results.scenarios')
});

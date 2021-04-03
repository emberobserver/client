import { helper } from '@ember/component/helper';

export default helper(function eventTargetValue([fn]) {
  return (event) => fn(event.target.value);
});

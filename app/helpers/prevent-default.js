import { helper } from '@ember/component/helper';

export default helper(function preventDefaultHelper([fn]) {
  return (event) => {
    event.preventDefault();
    fn();
  };
});

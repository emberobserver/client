import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  emberVersion: (i) => `2.${i}.0`,
  compatible: true,

  test_result_id: null
});

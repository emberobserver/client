import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  keyword: (i) => `keyword-${i}`,
  addon_ids: []
});

import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name: (i) => `keyword-${i}`,
  addon_ids: []
});

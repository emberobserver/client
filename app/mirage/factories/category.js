import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name: function(i) {
    return `Category ${i}`;
  },
  description: function(i) {
    return `Category for ${i}`;
  },
  addon_ids: [],
  parent_id: null,
  subcategory_ids: []
});

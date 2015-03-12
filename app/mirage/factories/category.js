import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name: function(i){
    return `Category ${i}`;
  },
  addon_ids: [],
  description: function(i){
    return `Category for ${i}`;
  }
});

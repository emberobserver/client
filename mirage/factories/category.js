import Mirage from 'miragejs';

export default Mirage.Factory.extend({
  name: (i) => `Category ${i}`,
  description: (i) => `Category for ${i}`,
  position: (i) => i + 1,
  addonCount: null,
});

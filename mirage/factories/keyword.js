import Mirage from 'miragejs';

export default Mirage.Factory.extend({
  keyword: (i) => `keyword-${i}`,
  addonIds: null,
});

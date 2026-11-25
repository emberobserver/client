import Mirage from 'miragejs';

export default Mirage.Factory.extend({
  name: (i) => `build-host-${i}`,
  token: 'abc123',
});

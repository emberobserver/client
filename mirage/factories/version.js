import Mirage from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  version: (i) => `1.0.${i}`,
  released: () => new Date(),
  emberCliVersion: '1.13.1'
});

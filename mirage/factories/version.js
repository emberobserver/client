import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  version: (i) => `1.0.${i}`,
  released: '2021-01-01T12:34:56Z',
  emberCliVersion: '1.13.1',
});

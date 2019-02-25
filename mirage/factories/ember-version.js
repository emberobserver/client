import Mirage, { faker } from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  version: (i) => `3.${i}.0`,
  released: () => faker.date.past()
});

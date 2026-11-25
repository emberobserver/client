import Mirage from 'miragejs';

import faker from 'faker';

export default Mirage.Factory.extend({
  version: (i) => `3.${i}.0`,
  released: () => faker.date.past(),
});

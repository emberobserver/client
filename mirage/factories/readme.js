import Mirage from 'miragejs';

import faker from 'faker';

export default Mirage.Factory.extend({
  contents: () => faker.lorem.paragraph(),
});

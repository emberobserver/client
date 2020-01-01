import Mirage from 'ember-cli-mirage';

import faker from 'faker';

export default Mirage.Factory.extend({
  contents: () => faker.lorem.paragraph()
});

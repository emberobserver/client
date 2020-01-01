import { Factory } from 'ember-cli-mirage';

import faker from 'faker';

export default Factory.extend({
  package: (i) => `ember-${i}`,
  dependencyType() {
    return faker.random.boolean() ? 'dependencies' : 'devDependencies';
  }
});

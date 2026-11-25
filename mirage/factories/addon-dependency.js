import { Factory } from 'miragejs';

import faker from 'faker';

export default Factory.extend({
  package: (i) => `ember-${i}`,
  dependencyType() {
    return faker.random.boolean() ? 'dependencies' : 'devDependencies';
  },
});

import { Factory, faker } from 'ember-cli-mirage';

export default Factory.extend({
  package: (i) => `ember-${i}`,
  dependencyType() {
    return faker.random.boolean() ? 'dependencies' : 'devDependencies';
  }
});

import Mirage, { faker } from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  contents: () => faker.lorem.paragraph()
});

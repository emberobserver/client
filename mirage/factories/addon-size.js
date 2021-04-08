import { Factory } from 'ember-cli-mirage';
import faker from 'faker';

export default Factory.extend({
  appJsSize: () => faker.random.number(),
  appCssSize: () => faker.random.number(),

  vendorJsSize: () => faker.random.number(),
  vendorCssSize: () => faker.random.number(),

  otherJsSize: () => faker.random.number(),
  otherCssSize: () => faker.random.number(),

  appJsGzipSize: () => faker.random.number(),
  appCssGzipSize: () => faker.random.number(),

  vendorJsGzipSize: () => faker.random.number(),
  vendorCssGzipSize: () => faker.random.number(),

  otherJsGzipSize: () => faker.random.number(),
  otherCssGzipSize: () => faker.random.number(),

  otherAssets() {
    let empty = {
      files: [],
    };
    return JSON.stringify(empty);
  },
});

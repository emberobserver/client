import { registerAsyncHelper } from '@ember/test';

export default registerAsyncHelper('visitAddon', function(_, addon) {
  visit(`/addons/${addon.name}`);
});

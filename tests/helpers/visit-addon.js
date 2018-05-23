import { visit } from '@ember/test-helpers';

export default async function visitAddon(addon) {
  return visit(`/addons/${addon.name}`);
}

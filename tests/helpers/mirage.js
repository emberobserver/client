import { setupMirage as upstreamSetupMirage } from 'ember-mirage/test-support';
import makeServer from '#mirage/servers/default';

/**
 * ember-cli-mirage found the server config by itself. ember-mirage takes it as an option.
 */
export function setupMirage(hooks) {
  upstreamSetupMirage(hooks, { createServer: () => makeServer('test') });
}

/**
 * For tests that start and stop the server themselves.
 */
export function startMirage() {
  return makeServer('test');
}

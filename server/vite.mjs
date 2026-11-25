import { createRequire } from 'node:module';

/**
 * Runs server/index.js in the Vite dev server, as `ember serve` did, for the app's proxies and mocks.
 *
 * @returns {import("vite").Plugin}
 */
export default function emberCliServer() {
  return {
    name: 'ember-cli-server',
    configureServer(server) {
      createRequire(import.meta.url)('./index.js')(server.middlewares);
    },
  };
}

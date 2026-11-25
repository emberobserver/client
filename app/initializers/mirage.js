import { importSync, isDevelopingApp, isTesting, macroCondition } from '@embroider/macros';
import config from '#config';

/**
 * ember-cli-mirage started the server from its own initializer, with these rules.
 * The import stays in the macro branch, so production builds have no mirage code.
 */
export function initialize() {
  if (macroCondition(isDevelopingApp())) {
    let settings = config['ember-cli-mirage'] ?? {};
    let enabled = settings.enabled ?? (config.environment === 'development' && !(settings.usingProxy ?? true));

    if (enabled && !isTesting() && !('FastBoot' in globalThis)) {
      let { default: makeServer } = importSync('#mirage/servers/default');

      makeServer(config.environment);
    }
  }
}

export default { initialize };

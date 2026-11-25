/**
 * Looking for services that come from addons?
 *
 * App-tree merging from libraries is not supported.
 * See: https://github.com/embroider-build/embroider/issues/2659
 *
 * For services, look in to either of:
 * - https://github.com/chancancode/ember-polaris-service-
 * - https://ember-primitives.pages.dev/6-utils/createService.md
 *   - https://ember-primitives.pages.dev/6-utils/createAsyncService.md
 */
import Application from '@ember/application';
import config from '#config';
import loadInitializers from 'ember-load-initializers';
import '@nullvoxpopuli/legacy-prototype-extensions/array';
import { on } from 'rsvp';
import setupInspector from '@embroider/legacy-inspector-support/ember-source-4.12';
import '@warp-drive/ember/install';
/**
 * `./config/environment` is there because these addons look up the app's config as `config:environment`:
 * @nullvoxpopuli/ember-router-scroll, ember-cli-showdown, ember-moment, ember-page-title.
 */
export default class App extends Application {
  modules = {
    './config/environment': { default: config },
    ...import.meta.glob('./router.*', { eager: true }),
    ...import.meta.glob('./routes/**/*', { eager: true }),
    ...import.meta.glob('./templates/**/*', { eager: true }),
    ...import.meta.glob('./services/**/*', { eager: true }),
    ...import.meta.glob('./controllers/**/*', { eager: true }),
    ...import.meta.glob('./models/**/*', { eager: true }),
    ...import.meta.glob('./adapters/**/*', { eager: true }),
    ...import.meta.glob('./serializers/**/*', { eager: true }),
    ...import.meta.glob('./transforms/**/*', { eager: true }),
  };
  inspector = setupInspector(this);
}
const initializers = import.meta.glob(
  './{initializers,instance-initializers}/*',
  { eager: true },
);
// each initializer is named after its file, without the extension
loadInitializers(
  App,
  '.',
  Object.fromEntries(
    Object.entries(initializers).map(([path, module]) => [
      path.replace(/\.\w+$/, ''),
      module,
    ]),
  ),
);
if (config.environment === 'production') {
  window.addEventListener('error', function ({ error }) {
    if (window.trackJs) {
      window.trackJs.track(error);
    }
    console.error(error);
  });
  // eslint-disable-line no-console
  on('error', function (error) {
    if (window.trackJs) {
      window.trackJs.track(error);
    }
    console.error(error);
  });
}
// eslint-disable-line no-console
if (config.environment === 'development' || config.environment === 'test') {
  Error.stackTraceLimit = 200;
}

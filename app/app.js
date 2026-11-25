import "@nullvoxpopuli/legacy-prototype-extensions/array";
import { on } from 'rsvp';
import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from "./config/environment";

import setupInspector from "@embroider/legacy-inspector-support/ember-source-4.12";
import compatModules from "@embroider/virtual/compat-modules";

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
  inspector = setupInspector(this);
}

loadInitializers(App, config.modulePrefix, compatModules);

if (config.environment === 'production') {
  window.addEventListener("error", function ({ error }) {
    if (window.trackJs) {
      window.trackJs.track(error);
    }

    console.error(error); // eslint-disable-line no-console
  });

  on('error', function (error) {
    if (window.trackJs) {
      window.trackJs.track(error);
    }

    console.error(error); // eslint-disable-line no-console
  });
}

if (config.environment === 'development' || config.environment === 'test') {
  Error.stackTraceLimit = 200;
}

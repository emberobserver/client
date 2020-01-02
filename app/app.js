import { on } from 'rsvp';
import Ember from 'ember';
import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(App, config.modulePrefix);

if (config.environment === 'production') {

  Ember.onerror = function(error) {

    if (window.trackJs) {
      window.trackJs.track(error);
    }

    console.error(error); // eslint-disable-line no-console

  };

  on('error', function(error) {

    if (window.trackJs) {
      window.trackJs.track(error);
    }

    console.error(error); // eslint-disable-line no-console

  });
}

if (config.environment === 'development' || config.environment === 'test') {
  Error.stackTraceLimit = 200;
}

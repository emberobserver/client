import { on } from 'rsvp';
import Ember from 'ember';
import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

import GoogleAnalytics from 'ember-metrics/metrics-adapters/google-analytics';
window.define('ember-metrics/metrics-adapters/google-analytics', function(){ return GoogleAnalytics; });
import LocalAnalytics from './metrics-adapters/local-adapter';
window.define('ember-observer/metrics-adapters/local-adapter', function(){ return LocalAnalytics; });


const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

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

export default App;

import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

var App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

loadInitializers(App, config.modulePrefix);

if (config.environment === 'production') {

  Ember.onerror = function(error) {

    if (window.trackJs) {
      window.trackJs.track(error);
    }

    Ember.Logger.assert(false, error);

  };

  Ember.RSVP.on('error', function(error) {

    if (window.trackJs) {
      window.trackJs.track(error);
    }

    Ember.Logger.assert(false, error);

  });
}

if (config.environment === 'development') {
  Error.stackTraceLimit=100;
}

export default App;

import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
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

    Ember.Logger.assert(false, error);

  };

  Ember.RSVP.on('error', function(error) {

    if (window.trackJs) {
      window.trackJs.track(error);
    }

    Ember.Logger.assert(false, error);

  });
}

if (config.environment === 'development' || config.environment === 'test') {
  Error.stackTraceLimit = 200;

  let originalWarn = Ember.warn;
  Ember.warn = function(message) {
    if(/You've included a link but no primary data/.test(message)){ return; }
    originalWarn(...arguments);
  };
}

export default App;

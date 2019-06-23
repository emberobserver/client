import classic from 'ember-classic-decorator';
import { on } from 'rsvp';
import Ember from 'ember';
import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

@classic
class AppApplication extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

loadInitializers(AppApplication, config.modulePrefix);

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

export default AppApplication;

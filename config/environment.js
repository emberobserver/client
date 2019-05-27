'use strict';

const parseFlag = require('./parse-flag');

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'ember-observer',
    environment,
    rootURL: '/',
    locationType: 'router-scroll',
    historySupportMiddleware: true,
    codeSearchPageSize: 50,
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    featureFlags: {
    }
  };

  ENV['ember-cli-mirage'] = {
    discoverEmberDataModels: false
  };

  if (parseFlag('COLLECT_METRICS', true)) {
    ENV.metricsAdapters = [
      {
        name: 'GoogleAnalytics',
        environments: ['production'],
        config: {
          id: 'UA-59673320-1'
        }
      },
      {
        name: 'LocalAdapter',
        environments: ['development']
      }
    ];
  }

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
    ENV.codeSearchPageSize = 3;

    ENV['ember-cli-mirage'] = {
      enabled: false
    };
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};

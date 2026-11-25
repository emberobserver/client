const ENV = {
  environment: import.meta.env.DEV ? 'development' : 'production',
  rootURL: '/',
  locationType: 'history',
  EmberENV: {},
  APP: {},
};

Object.assign(ENV, {
  codeSearchPageSize: 50,
  featureFlags: {},
});

ENV['ember-cli-mirage'] = {
  discoverEmberDataModels: false,
};

export default ENV;

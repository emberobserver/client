/* jshint node: true */

module.exports = function(deployTarget) {
  var ENV = {
    build: {}
    // include other plugin configuration that applies to all deploy targets here
  };

  ENV['with-rsync'] = {
    username: 'eo',
    root: '/srv/app/ember-observer/client'
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
  }

  if (deployTarget === 'beta') {
    ENV.build.environment = 'production';
    ENV['with-rsync'].host = 'emberobserver.com';
    ENV['with-rsync'].root = '/srv/app/beta.ember-observer/client';
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    ENV['with-rsync'].host = 'emberobserver.com';
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};

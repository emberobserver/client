'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const parseFlag = require('./config/parse-flag');
const env = EmberApp.env();
const broccoliAssetRevDefaults = require('broccoli-asset-rev/lib/default-options');

module.exports = function(defaults) {
  let options = {
    inlineContent: {},
    minifyJS: {},
    minifyCSS: {},
    fingerprint: {
      extensions: broccoliAssetRevDefaults.extensions.concat(['svg'])
    },
    sourcemaps: {
      extensions: ['js']
    }
  };

  if (parseFlag('FAVICON', true)) {
    options.inlineContent['snippets/favicon'] = 'app/snippets/favicon.html';
  }

  if (parseFlag('EXTERNAL_FONTS', true)) {
    options.inlineContent['snippets/external-fonts'] = 'app/snippets/external-fonts.html';
  }

  if (parseFlag('REPORT_ERRORS', env === 'production')) {
    options.inlineContent['snippets/trackjs'] = 'app/snippets/trackjs.html';
  }

  options.inlineContent['snippets/perf-utils'] = 'app/snippets/perf-utils.js';

  options.minifyJS.enabled = parseFlag('MINIFY_JS', env === 'production');

  options.minifyCSS.enabled = parseFlag('MINIFY_CSS', env === 'production');

  options.sourcemaps.enabled = parseFlag('SOURCEMAPS', env !== 'production');

  options.fingerprint.enabled = parseFlag('FINGERPRINT', env === 'production');

  let app = new EmberApp(defaults, options);

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  app.import('node_modules/dompurify/dist/purify.js', {
    using: [
      { transformation: 'amd', as: 'dom-purify' }
    ]
  });

  if (process.env.CLASSIC) {
    return app.toTree();
  }

  const Webpack = require('@embroider/webpack').Webpack;
  return require('@embroider/compat').compatBuild(app, Webpack, {

    // The default settings give maximum compatability, and they work fine here,
    // but we are also going to enable some optimizations.

    // These two flags are used when building classic addons to v2 format. They
    // cause any unused Javascript modules these addon trees to not be included
    // in the build. Most addons are fine with this, but some are not, so this
    // is an opt-in optmization.
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,

    // Resolve all helpers (in app and all addons) at build time. Unused helpers
    // will not be included. This is usually a safe optimization, as there are
    // not common ways of dynamically referring to helpers in templates.
    staticHelpers: true,

    // Resolve all components (in app and all addons) at build time. Unused
    // components will not be included. This is generally not a safe
    // optimization unless you also deal with any dynamic component warnings by
    // providing packageRules.
    staticComponents: true,

    // The packageRules system allows you to tell Embroider about sources of
    // dynamic dependencies in classic addons and apps that are otherwise not
    // statically analyzable.
    packageRules: [

      // You can have entries for any package, meaning apps and addons. This one
      // is for our own app. There are some packageRules that ship inside
      // Embroider for common addons, which you will get by default if you don't
      // override them in here.
      {
        package: 'ember-observer',
        components: {

          // this tells embroider not to warn us about:
          //
          //  {{#exclusive-button-group as |btn|}}
          //    {{component btn}}
          //  {{/exclusive-button-group}}
          //
          //
          // It is safe in this case because exclusive-button-group's
          // implementation does:
          //
          //   {{yield (component "exclusive-button" ...) }}
          //
          // which is a statically-analyzable source for the btn component.
          '{{exclusive-button-group}}': {
            yieldsSafeComponents: [ true ]
          }
        }
      }
    ]
  });
};

'use strict';

module.exports = {
  plugins: ["ember-template-lint-plugin-prettier"],

  extends: "recommended",

  rules: {
    prettier: true,

    'inline-link-to': true,
    'no-inline-styles': true,
    'no-duplicate-attributes': true,
    'no-input-block': true,
    'no-input-tagname': true,
    'no-unbound': true,
    'no-outlet-outside-routes': true,
    'no-trailing-spaces': true,
    'no-partial': true,
    'quotes': false,
    'table-groups': false,

    // disable formatting rules
    'block-indentation': false,
    'self-closing-void-elements': false
  }
};

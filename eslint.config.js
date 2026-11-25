/**
 * This tries to follow what the official blueprints are doing more closely
 * but in a way that abstracts the dependencies and configuration
 * out of your project.
 *
 * Handles: (G)TS + (G)JS, QUnit, Supporting Node files
 */
import { ember } from "ember-eslint";

export default [
  ...ember.recommended(import.meta.dirname),
  // your modifications here
  // see: https://eslint.org/docs/user-guide/configuring/configuration-files#how-do-overrides-work
  {
    rules: {
      "ember/avoid-leaking-state-in-ember-objects": "off",
      "ember/closure-actions": "off",
      "ember/use-brace-expansion": "off",
      "ember/no-classic-components": "off",
      "ember/no-get": "off",
      "ember/require-tagless-components": "off"
    }
  },
  {
    files: [
      "**/*.{js,ts}",
      "**/*.gjs",
      "**/*.gts"
    ],
    rules: {
      "ember/no-jquery": "error"
    }
  },
  {
    files: [
      "tests/**/*.js"
    ],
    ignores: [
      "tests/dummy/**/*.js"
    ],
    languageOptions: {
      globals: {
        server: true
      }
    }
  },
  {
    files: [
      ".eslintrc.js",
      ".prettierrc.js",
      ".template-lintrc.js",
      "ember-cli-build.js",
      "testem.js",
      "blueprints/*/index.js",
      "config/**/*.js",
      "lib/*/index.js",
      "server/**/*.js"
    ],
    rules: {
      "n/no-unpublished-require": "off"
    }
  },
];

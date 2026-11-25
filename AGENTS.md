<!-- ember.nvp:start -->

# ember-observer

An Ember app, generated with [ember.nvp](https://github.com/NullVoxPopuli/ember.nvp).

## Check your work

After a change, run these scripts in this order:

1. `pnpm lint`
2. `pnpm test`
3. `pnpm build`

## Scripts

- `pnpm build`: `vite build`
- `pnpm lint`: `concurrently "pnpm:lint:*(!fix)" --names "lint:" --prefixColors auto`
- `pnpm lint:fix`: `concurrently "pnpm:lint:*:fix" --names "fix:" --prefixColors auto`
- `pnpm lint:hbs`: `ember-template-lint .`
- `pnpm lint:hbs:fix`: `ember-template-lint . --fix`
- `pnpm start`: `vite`
- `pnpm test`: `pnpm build:test && pnpm test:ci`
- `pnpm dev`: `vite`
- `pnpm preview`: `vite preview`
- `pnpm lint:eslint`: `eslint . --cache`
- `pnpm lint:eslint:fix`: `eslint . --fix`
- `pnpm build:test`: `EMBER_ENV=test NODE_ENV=development vite build --mode development`
- `pnpm test:ci`: `testem ci --port 0`

## Modern Ember

This project uses Vite and template-tag components.
Code from older Ember versions does not work here.

- The `ember` CLI is not installed, so `ember generate` and `ember serve` fail. Use the scripts above.
- Write components in `.gjs` or `.gts` files, with `<template>`. Do not add `.hbs` files.
- Import `Component` from `@glimmer/component`, not from `@ember/component`.
- Use native classes, `@tracked`, and getters. Do not use `EmberObject`, `computed`, `get`, or `set`.
- Use `{{on}}` and `{{fn}}` in templates, not `{{action}}`.
- Import `trustHTML` from `@ember/template` to mark a string as safe HTML. Do not use `htmlSafe`.

## Project layout

- `app/app` registers the modules in `app/router`, `app/routes/`, `app/templates/`, and `app/services/`.
  Everything else (components, helpers, modifiers, utils) is imported where it is used.
- Services from libraries are not registered automatically.
  Re-export each one in `app/services/`, for example `app/services/page-title.js`:

  ```js
  export { default } from 'ember-page-title/services/page-title';
  ```

## Production build

`pnpm build`, then `pnpm preview`, serves the build on `$PORT`.
`vite preview` answers `index.html` for a URL with no file, so the router handles deep URLs.
This app needs no server of its own: to serve the build, for example from `start`, use `vite preview`.

`vite preview` does not build, and the code in the browser cannot read environment variables.
Vite writes them into the code when it builds:

- `VITE_` variables are on `import.meta.env`, for example `import.meta.env.VITE_API_URL`.
- For a variable without the prefix, add it with `define` in `vite.config.mjs`, then build again:

  ```js
  define: {
    "import.meta.env.API_URL": JSON.stringify(process.env.API_URL ?? ""),
  },
  ```

## Import aliases

From `imports` in `package.json`:

- `#app/*` → `./app/*`
- `#config` → `./app/config.js`
- `#components/*` → `./app/components/*`
- `#services/*` → `./app/services/*`
- `#test-helpers/*` → `./tests/helpers/*`
- `#utils/*` → `./app/utils/*`
- `#mirage/*` → `./mirage/*`

## Guides

- [Templates](https://raw.githubusercontent.com/ember-learn/guides-source/t3/port-glimmer-cheatsheet-reference/guides/release/reference/templates.md): syntax, keywords, and helpers.
  In `<template>`, these are keywords and need no import: `on`, `fn`, `eq`, `not`, `and`, `or`, and the other comparison helpers in the reference.
- [Application state](https://raw.githubusercontent.com/ember-learn/guides-source/nvp/lifetimes-of-state/guides/release/application-state/index.md): where each piece of state lives.
- [Reactivity](https://raw.githubusercontent.com/NullVoxPopuli/guides-source/nvp/reactivity/guides/release/in-depth-topics/reactivity/index.md): tracked state and derived state.

## Tests (QUnit)

- Test files live in `tests/`. A file in `app/` whose name ends in `-test` runs too.
- `pnpm test` builds the tests, then runs them in headless Chrome.
- To run only the tests whose names contain some text, build once, then filter:

  ```sh
  pnpm build:test
  pnpm test:ci --test_page "tests/index.html?hidepassed&filter=<text>"
  ```

- Read state from the DOM with `assert.dom()` from qunit-dom.

<!-- ember.nvp:end -->

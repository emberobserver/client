# Ember Observer [![Circle CI](https://circleci.com/gh/emberobserver/client.svg?style=svg)](https://circleci.com/gh/emberobserver/client)
[![codecov](https://codecov.io/gh/emberobserver/client/branch/master/graph/badge.svg)](https://codecov.io/gh/emberobserver/client)

This is the frontend code for the [Ember Observer](http://emberobserver.com/) website.

To work on this app, change the proxy to https://www.emberobserver.com

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `yarn install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

* `./deploy.sh`

## Depends On

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* [Bourbon](http://bourbon.io/) / [Neat](http://neat.bourbon.io/) / [Bitters](http://bitters.bourbon.io/) / [Refills](http://refills.bourbon.io/)

# Process when new Ember-CLI version is released

1. Generate new app using the new version
1. Compare set of dependencies to set of addons set to 'isCliDependency'

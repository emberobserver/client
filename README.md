# Ember Observer [![Circle CI](https://circleci.com/gh/emberobserver/client.svg?style=svg)](https://circleci.com/gh/emberobserver/client)
[![Code Climate](https://codeclimate.com/github/emberobserver/client/badges/gpa.svg)](https://codeclimate.com/github/emberobserver/client)

This is the frontend code for the [Ember Observer](http://emberobserver.com/) website.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `ember test`
* `ember test --server`

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

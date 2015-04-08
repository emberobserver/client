import Ember from 'ember';
import {
  module,
  test
} from 'qunit';
import startApp from 'ember-addon-review/tests/helpers/start-app';

var application;

module('Acceptance: Maintainers', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('can view page for a valid maintainer', function(assert) {
  server.create('maintainer', 1);

  visit('/maintainers/maintainer-0');

  andThen(function() {
    assert.equal(currentPath(), 'maintainers.show');
  });
});

test('trying to view a nonexistent maintainer redirects to not-found page', function(assert) {
  visit('/maintainers/404maintainernotfound');

  andThen(function() {
    assert.equal(currentPath(), 'not-found');
  });
});

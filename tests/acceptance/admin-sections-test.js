import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from 'ember-addon-review/tests/helpers/start-app';

module('Acceptance | admin sections', {
  beforeEach: function() {
    this.application = startApp();
  },

  afterEach: function() {
    Ember.run(this.application, 'destroy');
  }
});

test('"Addons needing categorization" section does not include WIP addons', function(assert) {
  server.createList('addon', 10);
  server.create('addon', { is_wip: true });

  login();
  visit('/admin');

  andThen(function() {
    assert.contains('.test-addons-needing-categorization h2', 'Addons needing categorization (10 / 11)', 'displays the correct number of addons in the header');
  });

  click('.test-addons-needing-categorization a:contains(Show)');

  andThen(function() {
    assert.contains('.test-addons-needing-categorization .test-addon-table-count', 'Displaying 10 addons', 'displays the correct number of addons in the count above the list')
    assert.equal(find('.test-addons-needing-categorization .addons-table tr').length, 10, 'displays the correct number of addons');
  });
});

test('"Addons needing review" section does not include WIP addons', function(assert) {
  server.createList('addon', 10);
  server.create('addon', { is_wip: true });

  login();
  visit('/admin');

  andThen(function() {
    assert.contains('.test-addons-needing-review h2', 'Addons needing review (10 / 11)', 'displays the correct number of addons in the section header')
  });

  click('.test-addons-needing-review a:contains(Show)');

  andThen(function() {
    assert.equal(find('.test-addons-needing-review .addons-table tr').length, 10, 'displays the correct number of addons');
  });
});

function login() {
  server.post('/authentication/login.json', function() {
    return {
      token: 'abc123'
    };
  });
  visit('/login');
  fillIn('.test-email', 'test@example.com');
  fillIn('.test-password', 'password123');
  click('.test-log-in');
}

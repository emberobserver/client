import { test } from 'qunit';
import moduleForAcceptance from 'ember-observer/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance: Maintainers');

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
    assert.equal(currentPath(), 'model-not-found');
  });
});

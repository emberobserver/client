import { test } from 'qunit';
import moduleForAcceptance from 'ember-addon-review/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | scroll reset after route transition');

test('reset scroll after transition to a route', function(assert) {
  server.create('maintainer', 1);
  visit('/');
  andThen(function() {
    assert.equal(currentURL(), '/');
    assert.equal(window.scrollY, 0);
    // move scroll down
    window.scrollTo(40, 80);
    visit('/maintainers/maintainer-0');
    andThen(function() {
      assert.equal(window.scrollY, 0);
      assert.equal(currentPath(), 'maintainers.show');
    });
  });
});

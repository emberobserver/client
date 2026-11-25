import { assert as emberAssert } from '@ember/debug';
import { module, test } from 'qunit';
import { isTesting } from '@embroider/macros';

/**
 * Addons such as ember-window-mock read `isTesting()` when their module loads,
 * which is before tests/test-helper.ts calls `setTesting(true)`.
 */
const isTestingAtLoad = isTesting();

module('@embroider/macros | runtime mode in tests', function () {
  /**
   * In compile-time mode `isTesting()` is inlined as `false` at build time,
   * regardless of what the runtime global config says. Only when the test
   * build runs the macros plugin in runtime mode (see babel.config.js +
   * EMBER_ENV=test) does `isTesting()` reflect the value set by
   * `setTesting(true)` in tests/test-helper.ts.
   */
  test('isTesting() is true', function (assert) {
    assert.true(isTesting());
  });

  test('isTesting() is true when a module loads', function (assert) {
    assert.true(isTestingAtLoad);
  });

  /**
   * `@ember/debug`'s `assert(description, condition)` is only active when
   * DEBUG is true (i.e. non-production builds). Assertions are stripped
   * from production bundles, so this also doubles as a sanity check that
   * the test build keeps DEBUG enabled.
   */
  test('@ember/debug assert throws when the condition is false', function (assert) {
    assert.throws(() => emberAssert('string', false));
  });
});

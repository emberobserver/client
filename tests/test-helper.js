import { getOwner } from '@ember/owner';
import {
  currentRouteName,
  currentURL,
  getSettledState,
  resetOnerror,
  setApplication,
  visit,
} from '@ember/test-helpers';
import { getPendingWaiterState } from '@ember/test-waiters';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';
import { setupEmberOnerrorValidation, start as qunitStart } from 'ember-qunit';
import { setTesting } from '@embroider/macros';

import config from '#config';
import '../app/styles/app.scss';

Object.assign(window, {
  visit,
  getSettledState,
  getPendingWaiterState,
  currentURL,
  currentRouteName,
  getOwner,
  snapshotTimers: (label) => {
    console.debug(
      label ?? 'snapshotTimers',
      JSON.parse(
        JSON.stringify({
          settled: getSettledState(),
          waiters: getPendingWaiterState(),
        }),
      ),
    );
  },
});

/**
 * The test modules, in their traditional location and co-located with the app.
 */
const tests = Object.assign(
  import.meta.glob(['./**/*.{js,ts,gjs,gts}', '!./test-helper.*']),
  import.meta.glob('./**/*-test.{js,ts,gjs,gts}', { base: '../app' }),
);

/**
 * Addons such as ember-window-mock read `isTesting()` when their module loads,
 * so the app and the tests load only after `setTesting(true)`.
 */
export async function start() {
  config.locationType = 'none';
  config.APP.rootElement = '#ember-testing';
  config.APP.autoboot = false;

  setTesting(true);

  config.codeSearchPageSize = 3;
  config['ember-cli-mirage'] = {
    enabled: false,
  };

  const { default: Application } = await import('#app/app.js');

  await Promise.all(Object.values(tests).map((load) => load()));

  setApplication(Application.create(config.APP));
  setup(QUnit.assert);
  setupEmberOnerrorValidation();

  QUnit.moduleStart(({ name }) => console.group(name));
  QUnit.testStart(({ name }) => console.group(name));
  QUnit.testDone(() => console.groupEnd());
  QUnit.moduleDone(() => console.groupEnd());
  QUnit.testDone(resetOnerror);

  await import('./helpers/qunit-assertions');
  await import('./helpers/mock-analytics');

  qunitStart();
}

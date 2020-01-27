import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import emberTryScenario from 'ember-observer/tests/helpers/ember-try-scenario';

module('Integration | Component | build-result-summary-table', function(hooks) {
  setupRenderingTest(hooks);

  test('displays a row for each scenario in the provided results', async function(assert) {
    this.emberTryResults = {
      scenarios: [
        emberTryScenario('3.4'),
        emberTryScenario('3.8'),
        emberTryScenario('3.12'),
        emberTryScenario('3.13'),
      ]
    };

    await render(hbs`
      <BuildResultSummaryTable @results={{this.emberTryResults}} />
    `);

    assert.dom('table tbody tr').exists({ count: 4 });
  });

  test('displays information for a scenario', async function(assert) {
    let scenario = emberTryScenario('3.13');
    this.emberTryResults = {
      scenarios: [
        scenario
      ]
    };

    await render(hbs`
      <BuildResultSummaryTable @results={{this.emberTryResults}} />
    `);

    assert.dom('tbody tr td:nth-child(1)').hasText(scenario.scenarioName, 'displays scenario name in first column');
    assert.dom('tbody tr td:nth-child(2)').hasText('Passed', 'displays result in second column');
  });

  test('when an allowed-to-fail scenario fails, result text reflects that', async function(assert) {
    let scenario = emberTryScenario('3.13');
    scenario.allowedToFail = true;
    scenario.passed = false;
    this.emberTryResults = {
      scenarios: [
        scenario
      ]
    };

    await render(hbs`
      <BuildResultSummaryTable @results={{this.emberTryResults}} />
    `);

    assert.dom('tbody tr td:nth-child(2)').hasText('Failed (allowed)');
  });
});

import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';

module('Integration | Component | toggle-switch', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders and can be toggled', async function(assert) {
    let toggleValue;

    this.set('onToggle', function(value) {
      toggleValue = value;
    });

    this.set('isChecked', false);
    await render(hbs`{{toggle-switch label="Test toggle" name="toggle-1" isChecked=isChecked onToggle=(action onToggle) class="test-toggle"}}`);

    assert.dom('.test-toggle').exists('Toggle renders');
    assert.dom('.test-toggle input').hasAttribute('name', 'toggle-switch-toggle-1', 'Input name uses passed in name');
    assert.dom('.test-toggle input').hasAttribute('id', 'toggle-switch-toggle-1', 'Input id uses passed in name');
    assert.dom('.test-toggle label').hasAttribute('for', 'toggle-switch-toggle-1', 'Label has for attribute same as input name');
    assert.dom('.test-toggle label').hasText('Test toggle');
    assert.dom('.test-toggle input').isNotChecked('Not initially checked');

    await click('.test-toggle input');

    assert.equal(toggleValue, true, 'onToggle is called');
    assert.dom('.test-toggle input').isChecked();
  });
});

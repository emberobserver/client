import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | build-result-output', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders build result output as preformatted text when it is not valid JSON', async function(assert) {
    this.set('buildResult', {
      output: "I'm a teapot!"
    });
    await render(hbs`<BuildResultOutput @buildResult={{buildResult}} />`);

    assert.dom('pre').hasText("I'm a teapot!", 'renders output in a <pre> tag');
  });

  test('renders output that is valid JSON', async function(assert) {
    this.set('buildResult', {
      output: JSON.stringify([
        {
          group: 'Group One',
          commands: [
            { command: 'ls', output: 'foo' },
          ]
        }
      ])
    });
    await render(hbs`<BuildResultOutput @buildResult={{buildResult}} />`);

    assert.dom(this.element).hasText('Hi');
  });
});

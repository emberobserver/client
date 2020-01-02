import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

module('Integration | Component | build-result-output', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders build result output as preformatted text when its format is "text"', async function(assert) {
    this.set('buildResult', {
      output: "I'm a teapot!",
      outputFormat: 'text'
    });
    await render(hbs`<BuildResultOutput @buildResult={{buildResult}} />`);

    assert.dom('pre').hasText("I'm a teapot!", 'renders output in a <pre> tag');
  });

  module('JSON-format test output', function() {
    test('renders command groups', async function(assert) {
      this.set('buildResult', {
        output: JSON.stringify([
          {
            group: 'Group One',
            commands: [
              { command: 'ls', output: 'foo' },
            ]
          },
          {
            group: 'Group Two',
            commands: [
              { command: 'rmdir foo', output: 'rmdir: foo: Not a directory' }
            ]
          }
        ]),
        outputFormat: 'json',
      });
      await render(hbs`<BuildResultOutput @buildResult={{buildResult}} />`);

      assert.dom('section').exists({ count: 2 }, 'renders <section> tags for each group');
    });

    test('displays command group details', async function(assert) {
      this.set('buildResult', {
        output: JSON.stringify([
          {
            group: 'Group One',
            commands: [
              { command: 'ls', output: 'foo' },
            ]
          }
        ]),
        outputFormat: 'json'
      });
      await render(hbs`<BuildResultOutput @buildResult={{buildResult}} />`);

      assert.dom('section > details > summary').hasText('Group One', 'displays group header');
      assert.dom('section > details > details > summary').hasText('ls', 'displays command in a <summary>');
      assert.dom('section > details > details > output').hasText('foo', 'displays command output as an <output>');
    });

    test('command element displays as open when command was not successful', async function(assert) {
      this.set('buildResult', {
        output: JSON.stringify([
          {
            group: 'Group One',
            commands: [
              { command: 'ls foo', output: 'ls: foo: No such file or directory', failed: true }
            ]
          }
        ]),
        outputFormat: 'json'
      });
      await render(hbs`<BuildResultOutput @buildResult={{buildResult}} />`);

      assert.dom('section > details > details').hasAttribute('open');
    });

    test('when a group has has_failures: true, that group is open by default', async function(assert) {
      this.set('buildResult', {
        output: JSON.stringify([
          {
            group: 'Group One',
            has_failures: true
          }
        ]),
        outputFormat: 'json'
      });
      await render(hbs`<BuildResultOutput @buildResult={{buildResult}} />`);

      assert.dom('section > details').hasAttribute('open');
    });

    test('when a group has has_failures: false, that group is not open by default', async function(assert) {
      this.set('buildResult', {
        output: JSON.stringify([
          {
            group: 'Group One',
            has_failures: false
          }
        ]),
        outputFormat: 'json'
      });
      await render(hbs`<BuildResultOutput @buildResult={{buildResult}} />`);

      assert.dom('section > details').doesNotHaveAttribute('open');
    });
  });
});

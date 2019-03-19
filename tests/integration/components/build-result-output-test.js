import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | build-result-output', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders build result output', async function(assert) {
    this.set('buildResult', {
      output: "I'm a teapot!"
    });
    await render(hbs`<BuildResultOutput @buildResult={{buildResult}} />`);

    assert.dom('pre').hasText("I'm a teapot!", 'renders output in a <pre> tag');
  });
});

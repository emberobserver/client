import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import domPurify from "#app/helpers/dom-purify.js";

module('Integration | Helper | dom-purify', function (hooks) {
  setupRenderingTest(hooks);

  test('it sanitizes output', async function (assert) {
    this.set('dirty', '<img src=x onerror=alert(1)//>');

    await render(<template>{{domPurify this.dirty}}</template>);

    assert.equal(this.element.innerHTML, '<img src="x">', 'Sanitizes');
  });

  test('removes <style> elements', async function (assert) {
    this.set('dirty', 'HI!<style> a { color: "green"; }</style>');

    await render(<template>{{domPurify this.dirty}}</template>);

    assert.equal(this.element.innerHTML, 'HI!', 'Removes style elements');
  });

  test('adds attributes to anchors', async function (assert) {
    this.set('dirty', '<A HREF=//google.com>click</A>');

    await render(<template>{{domPurify this.dirty}}</template>);

    assert.dom('a').hasAttribute('href', '//google.com');
    assert
      .dom('a')
      .hasAttribute('target', '_blank', 'Target is set on anchors');
    assert
      .dom('a')
      .hasAttribute(
        'rel',
        'noopener nofollow',
        'rel noopener nofollow on anchors'
      );
  });
});

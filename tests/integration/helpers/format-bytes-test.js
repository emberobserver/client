import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | format-bytes', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders nothing if size is null', async function(assert) {
    this.set('inputValue', null);

    await render(hbs`{{format-bytes inputValue}}`);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('it renders bytes', async function(assert) {
    this.set('inputValue', '12');

    await render(hbs`{{format-bytes inputValue}}`);

    assert.equal(this.element.textContent.trim(), '12 B');
  });

  test('it renders kilobytes', async function(assert) {
    this.set('inputValue', '7785');

    await render(hbs`{{format-bytes inputValue}}`);

    assert.equal(this.element.textContent.trim(), '7.6 KB');
  });

  test('it renders one kilobyte', async function(assert) {
    this.set('inputValue', '1024');

    await render(hbs`{{format-bytes inputValue}}`);

    assert.equal(this.element.textContent.trim(), '1 KB');
  });

  test('it renders megabytes', async function(assert) {
    this.set('inputValue', '2809565');

    await render(hbs`{{format-bytes inputValue}}`);

    assert.equal(this.element.textContent.trim(), '2.68 MB');
  });

  test('it renders one megabyte', async function(assert) {
    this.set('inputValue', '1048576');

    await render(hbs`{{format-bytes inputValue}}`);

    assert.equal(this.element.textContent.trim(), '1 MB');
  });

  test('it renders gigabytes', async function(assert) {
    this.set('inputValue', '1095216660');

    await render(hbs`{{format-bytes inputValue}}`);

    assert.equal(this.element.textContent.trim(), '1.02 GB');
  });

  test('it renders one gigabyte', async function(assert) {
    this.set('inputValue', '1073741824');

    await render(hbs`{{format-bytes inputValue}}`);

    assert.equal(this.element.textContent.trim(), '1 GB');
  });
});

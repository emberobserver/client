import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | dependency-size-toggle', function (hooks) {
  setupRenderingTest(hooks);

  test('renders size summary', async function (assert) {
    let addonSize = {
      totalSize: 2048,
      totalGzipSize: 900,
    };

    this.set('addonSize', addonSize);

    await render(hbs`<DependencySizeToggle @addonSize={{addonSize}}/>`);

    assert.dom('.test-size-summary').exists();
    assert
      .dom('.test-size-summary')
      .hasText('2 KB (900 B gzipped)', 'Shows size summary');
  });

  test('renders size details when expanded', async function (assert) {
    let addonSize = {
      appJsSize: 1024,
      appJsGzipSize: 400,

      appCssSize: 800,
      appCssGzipSize: 200,

      vendorJsSize: 1536,
      vendorJsGzipSize: 900,

      vendorCssSize: 2048,
      vendorCssGzipSize: 1000,

      otherAssetsSize: 1836,
      otherAssetsGzipSize: 1100,

      totalJsSize: 3200,
      totalJsGzipSize: 1500,

      totalCssSize: 3000,
      totalCssGzipSize: 1200,

      totalSize: 6000,
      totalGzipSize: 2080,
    };

    this.set('addonSize', addonSize);

    await render(hbs`<DependencySizeToggle @addonSize={{addonSize}}/>`);

    assert
      .dom('.test-size-detail')
      .doesNotExist('Does not show detail before expanding');

    await click('.test-size-summary');

    assert.dom('.test-size-detail').exists('Shows detail after expanding');

    assert.dom('.test-app-js').exists();
    assert.dom('.test-app-css').exists();
    assert.dom('.test-vendor-js').exists();
    assert.dom('.test-vendor-css').exists();
    assert.dom('.test-other-assets').exists();
    assert.dom('.test-total-js').exists();
    assert.dom('.test-total-css').exists();

    await click('.test-size-summary');

    assert
      .dom('.test-size-detail')
      .doesNotExist('Detail gone after collapsing');
  });

  test('does not show if no addon size given', async function (assert) {
    this.set('addonSize', null);

    await render(hbs`<DependencySizeToggle @addonSize={{addonSize}}/>`);

    assert
      .dom('.test-size-summary')
      .doesNotExist('Does not show summary if no addon size');
  });

  test('does now show if total size is 0', async function (assert) {
    let addonSize = {
      totalSize: 0,
      totalGzipSize: 20,
    };

    this.set('addonSize', addonSize);

    await render(hbs`<DependencySizeToggle @addonSize={{addonSize}}/>`);

    assert
      .dom('.test-size-summary')
      .doesNotExist('Does not show summary if addon size is 0');
  });

  test('toggling details resets other assets state', async function (assert) {
    let addonSize = {
      appJsSize: 1024,
      appJsGzipSize: 400,

      otherAssetsSize: 1836,
      otherAssetsGzipSize: 1100,

      totalJsSize: 3200,
      totalJsGzipSize: 1500,

      totalSize: 6000,
      totalGzipSize: 2080,

      normalizedOtherAssetFiles: [
        {
          name: 'auto-import-fastboot.js',
          size: 57729,
          gzipSize: 16869,
        },
        {
          name: 'chunk.js',
          size: 57729,
          gzipSize: 16869,
        },
      ],

      hasOtherAssetsFiles: true,
    };

    this.set('addonSize', addonSize);

    await render(hbs`<DependencySizeToggle @addonSize={{addonSize}}/>`);

    await click('.test-size-summary');
    await click('.test-other-assets-toggle');
    await click('.test-size-summary');
    await click('.test-size-summary');

    assert
      .dom('.test-other-assets-details')
      .doesNotExist('Other assets state reset');
  });
});

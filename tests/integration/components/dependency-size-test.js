import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | dependency-size', function (hooks) {
  setupRenderingTest(hooks);

  test('renders size summary', async function (assert) {
    let addonSize = {
      totalSize: 2048,
      totalGzipSize: 900,
    };

    this.set('addonSize', addonSize);

    await render(hbs`<DependencySize @addonSize={{addonSize}}/>`);

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

    await render(hbs`<DependencySize @addonSize={{addonSize}}/>`);

    assert
      .dom('.test-size-detail')
      .doesNotExist('Does not show detail before expanding');

    await click('.test-size-summary');

    assert.dom('.test-size-detail').exists('Shows detail after expanding');

    assert.dom('.test-app-js').hasText('1 KB (400 B gzipped)');
    assert.dom('.test-app-css').hasText('800 B (200 B gzipped)');
    assert.dom('.test-vendor-js').hasText('1.5 KB (900 B gzipped)');
    assert.dom('.test-vendor-css').hasText('2 KB (1000 B gzipped)');
    assert.dom('.test-other-assets').hasText('1.79 KB (1.07 KB gzipped)');
    assert.dom('.test-total-js').hasText('3.13 KB (1.46 KB gzipped)');
    assert.dom('.test-total-css').hasText('2.93 KB (1.17 KB gzipped)');

    await click('.test-size-summary');

    assert
      .dom('.test-size-detail')
      .doesNotExist('Detail gone after collapsing');
  });

  test('skips rows that have 0 size', async function (assert) {
    let addonSize = {
      appJsSize: 1024,
      appJsGzipSize: 400,

      totalJsSize: 3200,
      totalJsGzipSize: 1500,

      totalSize: 6000,
      totalGzipSize: 2080,
    };

    this.set('addonSize', addonSize);

    await render(hbs`<DependencySize @addonSize={{addonSize}}/>`);

    assert
      .dom('.test-size-detail')
      .doesNotExist('Does not show detail before expanding');

    await click('.test-size-summary');

    assert.dom('.test-size-detail').exists('Shows detail after expanding');

    assert.dom('.test-app-js').hasText('1 KB (400 B gzipped)');
    assert.dom('.test-total-js').hasText('3.13 KB (1.46 KB gzipped)');

    assert.dom('.test-app-css').doesNotExist('Does not show row if size is 0');
    assert
      .dom('.test-vendor-js')
      .doesNotExist('Does not show row if size is 0');
    assert
      .dom('.test-vendor-css')
      .doesNotExist('Does not show row if size is 0');
    assert
      .dom('.test-other-js')
      .doesNotExist('Does not shfilow row if size is 0');
    assert
      .dom('.test-other-assets')
      .doesNotExist('Does not show row if size is 0');

    await click('.test-size-summary');
  });

  test('does not show if no addon size given', async function (assert) {
    this.set('addonSize', null);

    await render(hbs`<DependencySize @addonSize={{addonSize}}/>`);

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

    await render(hbs`<DependencySize @addonSize={{addonSize}}/>`);

    assert
      .dom('.test-size-summary')
      .doesNotExist('Does not show summary if addon size is 0');
  });

  test('can view other asset files', async function (assert) {
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

    await render(hbs`<DependencySize @addonSize={{addonSize}}/>`);

    await click('.test-size-summary');

    assert
      .dom('.test-other-assets-details')
      .doesNotExist('Does not show other assets by default');

    await click('.test-other-assets-toggle');

    let otherAssetsDetails = findAll('.test-other-assets-details');
    assert.equal(otherAssetsDetails.length, 2, 'Shows each asset file');

    assert
      .dom(otherAssetsDetails[0])
      .containsText('auto-import-fastboot.js', 'Shows first asset name');
    assert
      .dom(otherAssetsDetails[0])
      .containsText('56.38 KB (16.47 KB gzipped)', 'Shows first asset size');

    assert
      .dom(otherAssetsDetails[1])
      .containsText('chunk.js', 'Shows second asset name');
    assert
      .dom(otherAssetsDetails[1])
      .containsText('56.38 KB (16.47 KB gzipped)', 'Shows second asset size');

    await click('.test-other-assets-toggle');

    assert
      .dom('.test-other-assets-details')
      .doesNotExist('Detail gone after collapsing');
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

    await render(hbs`<DependencySize @addonSize={{addonSize}}/>`);

    await click('.test-size-summary');
    await click('.test-other-assets-toggle');
    await click('.test-size-summary');
    await click('.test-size-summary');

    assert
      .dom('.test-other-assets-details')
      .doesNotExist('Other assets state reset');
  });
});

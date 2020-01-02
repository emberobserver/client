import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';

module('Integration | Component | score-display', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.set('addon', {
      score: 5,
      hasBeenReviewed: false,
    });

    await render(hbs`
      {{#score-display addon=addon as |score|}}
        {{score}}
      {{/score-display}}
    `);

    assert.dom('.score').hasText('?', 'Score is unknown because it has not been reviewed');

    this.set('addon', {
      score: 5,
      hasBeenReviewed: true,
    });

    assert.dom('.score').hasText('5.0', 'Score displays with a fixed decimal');

    this.set('addon', {
      score: 0,
      hasBeenReviewed: true,
    });

    assert.dom('.score').hasText('0.0', 'Score displays with a fixed decimal');

    this.set('addon', {
      score: null,
      hasBeenReviewed: true,
    });

    assert.dom('.score').hasText('?', 'Score displays ? when no score');

    this.set('addon', {
      score: 10,
      hasBeenReviewed: true,
    });

    assert.dom('.score').hasText('10', 'Score displays 10 with no decimals');

    this.set('addon', {
      score: 5,
      hasBeenReviewed: true,
      isWip: true,
    });

    assert.dom('.score').hasText('WIP', 'WIP shows no score');

    this.set('addon', {
      score: 5,
      hasBeenReviewed: true,
      isWip: true,
      isDeprecated: true,
    });

    assert.dom('.score').hasText('x', 'Deprecated shows x');
  });
});

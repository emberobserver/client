import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('score-detail', 'Integration | Component | score display', {
  integration: true
});

test('displays WIP for score when addon is marked as WIP', function(assert) {
  let addonFake = Ember.Object.create({ isWip: true });

  renderComponent.call(this, addonFake);
  assert.equal(this.$('.score').text().trim(), 'WIP');
});

test('displays 0 for score when addon has zero score', function(assert) {
  let addonFake = Ember.Object.create({ score: 0 });

  renderComponent.call(this, addonFake);
  assert.equal(this.$('.score').text().trim(), '0');
});

test('displays N/A for score when addon has no score', function(assert) {
  let addonFake = Ember.Object.create({ score: null });

  renderComponent.call(this, addonFake);
  assert.equal(this.$('.score').text().trim(), 'N/A');
});

test('displays score when score is a number', function(assert) {
  let addonFake = Ember.Object.create({ score: 10 });

  renderComponent.call(this, addonFake);
  assert.equal(this.$('.score').text().trim(), '10');
});

function renderComponent(addonFake) {
  this.set('addon', addonFake);
  this.render(hbs`
    {{#score-display addon=addon as |score|}}
      {{score}}
    {{/score-display}}
  `);
}

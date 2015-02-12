import Ember from 'ember';
import ScrollMixin from 'ember-addon-review/mixins/scroll';

module('ScrollMixin');

// Replace this with your real tests.
test('it works', function() {
  var ScrollObject = Ember.Object.extend(ScrollMixin);
  var subject = ScrollObject.create();
  ok(subject);
});

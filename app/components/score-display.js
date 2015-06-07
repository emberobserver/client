import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  hasNumericScore: Ember.computed('addon.score', function() {
    var score = this.get('addon.score');
    return typeof(score) === 'number';
  })
});

import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  hasNumericScore: function() {
    var score = this.get('addon.score');
    return typeof(score) === 'number';
  }.property('addon.score')
});

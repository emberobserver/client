import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  hasNumericScore: function() {
    let score = this.get('addon.score');
    return typeof(score) === 'number';
  }.property('addon.score')
});

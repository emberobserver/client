import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  hasNumericScore: Ember.computed('addon.score', function() {
    let score = this.get('addon.score');
    return typeof(score) === 'number';
  })
});

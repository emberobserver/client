import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'time',
  attributeBindings: ['isoDate:datetime', 'isoDate:title'],

  date: null,
  isoDate: function() {
    let date = this.get('date');
    return date ? date.toISOString() : null;
  }.property('date')
});

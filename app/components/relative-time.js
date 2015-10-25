import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'time',
  attributeBindings: ['isoDate:datetime', 'isoDate:title'],

  date: null,
  isoDate: Ember.computed('date', function() {
    let date = this.get('date');
    return date ? date.toISOString() : null;
  })
});

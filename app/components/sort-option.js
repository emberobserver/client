import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  isSelected: function() {
    return this.get('selectedSort') === this.get('key');
  }.property('selectedSort', 'key'),
  actions: {
    sortBy: function(key) {
      this.sendAction('sortBy', key);
    }
  }
});

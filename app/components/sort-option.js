import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  isSelected: Ember.computed('selectedSort', 'key', function() {
    return this.get('selectedSort') === this.get('key');
  }),
  actions: {
    sortBy(key) {
      this.sendAction('sortBy', key);
    }
  }
});

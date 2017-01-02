import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'span',
  isSelected: function() {
    let selected = this.get('selected');
    let opt = this.get('option');
    if (!selected) {
      return false;
    }
    return opt.value === selected.value;
  }.property('selected', 'option'),
  actions: {
    select(option) {
      this.sendAction('action', option);
    }
  }
});
